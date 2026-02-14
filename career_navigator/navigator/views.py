import base64
import json
from io import BytesIO
import re
import requests
from requests.exceptions import SSLError
import urllib3
from PyPDF2 import PdfReader
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .services.skill_extractor import extract_user_skills
from .services.role_skill_extractor import extract_role_skills
from .services.gap_analyzer import (
    calculate_alignment,
    identify_missing_skills,
    calculate_readiness_estimate,
)
from .services.planner import generate_30_day_plan
from .services.role_data import ROLE_SKILL_FALLBACK, ROLE_ROADMAP_FALLBACK

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def parse_pdf_base64(file_data):
    decoded = base64.b64decode(file_data)
    reader = PdfReader(BytesIO(decoded))
    text = "".join(page.extract_text() or "" for page in reader.pages)
    return text


def fetch_github_summary(username):
    if not username:
        return {}
    url = f"https://api.github.com/users/{username}/repos?per_page=50"
    headers = {"Accept": "application/vnd.github+json", "User-Agent": "career-navigator-local"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
    except SSLError:
        response = requests.get(url, headers=headers, timeout=10, verify=False)
    response.raise_for_status()
    repos = response.json() or []
    languages = {repo.get("language") for repo in repos if repo.get("language")}
    topics = set()
    for repo in repos:
        for topic in repo.get("topics", []) or []:
            topics.add(topic)
    return {
        "repoCount": len(repos),
        "languages": list(languages),
        "topics": list(topics),
        "username": username,
    }


def fetch_linkedin_summary(access_token):
    if not access_token:
        return {}

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }

    profile_response = requests.get("https://api.linkedin.com/v2/me", headers=headers, timeout=12)
    profile_response.raise_for_status()
    profile = profile_response.json() or {}

    email = None
    try:
        email_response = requests.get(
            "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
            headers=headers,
            timeout=12,
        )
        if email_response.ok:
            elements = (email_response.json() or {}).get("elements", [])
            if elements:
                email = ((elements[0] or {}).get("handle~") or {}).get("emailAddress")
    except Exception:
        email = None

    full_name = " ".join(filter(None, [profile.get("localizedFirstName"), profile.get("localizedLastName")])).strip()
    return {
        "id": profile.get("id"),
        "fullName": full_name,
        "headline": profile.get("headline") or "",
        "email": email,
        "rawProfile": profile,
    }


KEYWORD_SKILLS = {
    "technical": [
        "python", "java", "javascript", "typescript", "react", "node", "sql", "django", "flask", "api",
        "machine learning", "data analysis", "excel", "tableau", "power bi", "a/b testing", "statistics",
    ],
    "tools": [
        "git", "github", "docker", "firebase", "figma", "jira", "vscode", "postman",
    ],
    "soft": [
        "communication", "leadership", "collaboration", "problem solving", "stakeholder management", "storytelling",
    ],
}


def _normalize_skills(skills):
    if not isinstance(skills, dict):
        skills = {}
    return {
        "technical": [str(item) for item in (skills.get("technical") or [])],
        "tools": [str(item) for item in (skills.get("tools") or [])],
        "soft": [str(item) for item in (skills.get("soft") or [])],
        "experience_level": str(skills.get("experience_level") or "Intermediate"),
    }


def _extract_skills_fallback(combined_text, github_summary):
    text = (combined_text or "").lower()
    found = {"technical": set(), "tools": set(), "soft": set()}

    for category, candidates in KEYWORD_SKILLS.items():
        for candidate in candidates:
            pattern = rf"\b{re.escape(candidate)}\b"
            if re.search(pattern, text):
                found[category].add(candidate.title())

    for language in github_summary.get("languages", []) or []:
        if language:
            found["technical"].add(str(language))
    if github_summary.get("repoCount", 0) > 0:
        found["tools"].add("GitHub")

    return {
        "technical": sorted(found["technical"]),
        "tools": sorted(found["tools"]),
        "soft": sorted(found["soft"]),
        "experience_level": "Intermediate",
    }


def _build_fallback_plan(missing_skills, experience_level, hours_per_day, dream_role):
    role_plan = ROLE_ROADMAP_FALLBACK.get(dream_role)
    if role_plan:
        return role_plan

    technical = (missing_skills or {}).get("missing_technical", [])[:8]
    soft = (missing_skills or {}).get("missing_soft", [])[:4]

    return {
        "week_1": {
            "focus": "Core foundations",
            "tasks": [
                f"Study 60-90 minutes/day ({hours_per_day}h target) on top missing technical skill",
                *( [f"Practice basics of {technical[0]}"] if technical else ["Practice core concepts for your target role"] ),
                "Create concise notes and examples from your learning sessions",
            ],
            "project": "Build a small proof-of-concept project using one core skill",
            "checkpoint": f"Complete 5 focused sessions and self-review at {experience_level} level",
        },
        "week_2": {
            "focus": "Applied practice",
            "tasks": [
                *( [f"Implement one feature using {technical[1]}"] if len(technical) > 1 else ["Implement one role-relevant feature end-to-end"] ),
                "Write a short case-study style summary of your decisions",
                "Request feedback from one peer/mentor",
            ],
            "project": "Extend the project with measurable outcomes",
            "checkpoint": "Demonstrate feature completion with before/after comparison",
        },
        "week_3": {
            "focus": "Portfolio and communication",
            "tasks": [
                "Refactor and document your project repository",
                "Add README sections for impact, architecture, and lessons learned",
                *( [f"Practice {soft[0]} in mock presentation/interview"] if soft else ["Practice communication in mock interview format"] ),
            ],
            "project": "Publish one polished portfolio artifact",
            "checkpoint": "Share a demo and collect structured feedback",
        },
        "week_4": {
            "focus": "Interview readiness",
            "tasks": [
                "Run 2 mock interviews with role-specific questions",
                "Prepare STAR examples tied to your recent project work",
                "Create a targeted application tracker",
            ],
            "project": "Final role-aligned capstone iteration",
            "checkpoint": "Submit at least 5 targeted applications with tailored resume bullets",
        },
    }


@api_view(["GET"])
def health_check(request):
    return Response({"message": "Career Navigator API Running"})


@api_view(["POST"])
def analyze_profile(request):
    payload = request.data
    dream_role = payload.get("dream_role") or "Product Analyst"
    linkedin_text = payload.get("linkedin_text") or ""
    linkedin_access_token = payload.get("linkedin_access_token") or ""
    resume_text = payload.get("resume_text") or ""
    resume_file = payload.get("resume_file_base64")
    github_username = payload.get("github_username")
    try:
        hours_per_day = int(payload.get("hours_per_day") or 2)
    except (TypeError, ValueError):
        hours_per_day = 2
    experience_level = payload.get("experience_level") or "Intermediate"
    warnings = []

    if not any([linkedin_text.strip(), linkedin_access_token.strip(), resume_text.strip(), resume_file, (github_username or "").strip()]):
        return Response({"error": "Provide at least one input: github_username, linkedin_access_token, linkedin_text, resume_text, or resume_file_base64."}, status=400)

    if resume_file:
        try:
            resume_text = parse_pdf_base64(resume_file)
        except Exception as exc:
            return Response({"error": f"Failed to parse resume file: {str(exc)}"}, status=400)

    github_summary = {}
    try:
        github_summary = fetch_github_summary(github_username)
    except Exception as exc:
        warnings.append(f"GitHub import failed: {str(exc)}")
        github_summary = {}

    linkedin_summary = {}
    if linkedin_access_token.strip():
        try:
            linkedin_summary = fetch_linkedin_summary(linkedin_access_token.strip())
        except Exception as exc:
            warnings.append(f"LinkedIn API import failed: {str(exc)}")
            linkedin_summary = {}

    combined_text = "\n".join([
        resume_text,
        linkedin_text,
        json.dumps(linkedin_summary),
        json.dumps(github_summary),
    ])

    try:
        user_skills = extract_user_skills(combined_text)
    except Exception as exc:
        warnings.append(f"AI skill extraction unavailable ({str(exc)}). Used fallback extraction.")
        user_skills = _extract_skills_fallback(combined_text, github_summary)

    if isinstance(user_skills, dict) and user_skills.get("error"):
        warnings.append(f"AI skill extraction returned an error ({user_skills.get('error')}). Used fallback extraction.")
        user_skills = _extract_skills_fallback(combined_text, github_summary)

    user_skills = _normalize_skills(user_skills)

    try:
        role_skills = extract_role_skills(dream_role)
    except Exception as exc:
        warnings.append(f"AI role extraction unavailable ({str(exc)}). Used fallback role map.")
        role_skills = ROLE_SKILL_FALLBACK.get(dream_role, ROLE_SKILL_FALLBACK["default"])

    if isinstance(role_skills, dict) and role_skills.get("error"):
        warnings.append(f"AI role extraction returned an error ({role_skills.get('error')}). Used fallback role map.")
        role_skills = ROLE_SKILL_FALLBACK.get(dream_role, ROLE_SKILL_FALLBACK["default"])

    role_skills = _normalize_skills(role_skills)

    alignment_score = calculate_alignment(user_skills, role_skills)
    missing_skills = identify_missing_skills(user_skills, role_skills)
    readiness = calculate_readiness_estimate(alignment_score)
    try:
        plan = generate_30_day_plan(missing_skills, experience_level, hours_per_day)
    except Exception as exc:
        warnings.append(f"AI planner unavailable ({str(exc)}). Used fallback 4-week plan.")
        plan = _build_fallback_plan(missing_skills, experience_level, hours_per_day, dream_role)

    if isinstance(plan, dict) and plan.get("error"):
        warnings.append(f"AI planner returned an error ({plan.get('error')}). Used fallback 4-week plan.")
        plan = _build_fallback_plan(missing_skills, experience_level, hours_per_day, dream_role)

    roadmap = []
    for week_key, content in plan.items():
        roadmap.append({
            "week": week_key.replace("_", " ").title(),
            "focus": content.get("focus"),
            "tasks": content.get("tasks", []),
            "project": content.get("project"),
            "checkpoint": content.get("checkpoint"),
        })

    projects = [item.get("project") for item in roadmap if item.get("project")]
    checkpoints = [item.get("checkpoint") for item in roadmap if item.get("checkpoint")]
    resources = [
        "Use the dataset-driven job descriptions for your target role",
        "Review one mock interview guide per week",
    ]

    return Response({
        "dream_role": dream_role,
        "github_summary": github_summary,
        "linkedin_summary": linkedin_summary,
        "user_skills": user_skills,
        "role_skills": role_skills,
        "missing_skills": missing_skills,
        "alignment_score": alignment_score,
        "readiness": readiness,
        "roadmap": roadmap,
        "projects": projects,
        "resources": resources,
        "checkpoints": checkpoints,
        "warnings": warnings,
    })
