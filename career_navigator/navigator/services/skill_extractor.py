import json
from .groq_client import call_groq


def extract_user_skills(resume_text):

    prompt = f"""
    Extract structured skills from the following resume.

    Return ONLY valid JSON in this format:

    {{
      "technical": [],
      "tools": [],
      "soft": [],
      "experience_level": "Beginner | Intermediate | Advanced"
    }}

    Resume:
    {resume_text}
    """

    response = call_groq(prompt)

    try:
        skills = json.loads(response)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON from Groq"}

    return skills
