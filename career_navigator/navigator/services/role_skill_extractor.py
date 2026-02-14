from .groq_client import call_llm, parse_llm_json
from .dataset_loader import get_role_descriptions

# In-memory cache
ROLE_SKILL_CACHE = {}

def extract_role_skills(role_name):

    if role_name in ROLE_SKILL_CACHE:
        return ROLE_SKILL_CACHE[role_name]

    descriptions = get_role_descriptions(role_name)

    prompt = f"""
    Extract required skills from the following job descriptions.

    Return ONLY valid JSON in this format:

    {{
      "technical": [],
      "tools": [],
      "soft": []
    }}

    Job Descriptions:
    {descriptions[:8000]}
    """

    response = call_llm(prompt)

    try:
        skills = parse_llm_json(response)
    except ValueError:
        return {"error": "Invalid JSON from LLM"}

    ROLE_SKILL_CACHE[role_name] = skills
    return skills
