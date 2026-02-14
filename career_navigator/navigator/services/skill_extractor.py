from .groq_client import call_llm, parse_llm_json


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

    response = call_llm(prompt)

    try:
        skills = parse_llm_json(response)
    except ValueError:
        return {"error": "Invalid JSON from LLM"}

    return skills
