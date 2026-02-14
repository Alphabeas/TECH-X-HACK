from .groq_client import call_llm, parse_llm_json


def generate_30_day_plan(
    missing_skills,
    experience_level="Intermediate",
    hours_per_day=2
):

    prompt = f"""
    You are an AI career planning system.

    The user:
    - Level: {experience_level}
    - Study time per day: {hours_per_day} hours

    Missing Technical Skills:
    {missing_skills["missing_technical"]}

    Missing Soft Skills:
    {missing_skills["missing_soft"]}

    RULES:
    - Generate EXACTLY 4 weeks.
    - Only week_1, week_2, week_3, week_4.
    - Do NOT generate week_5 or beyond.
    - No repetition.
    - Keep tasks concise.
    - Strictly valid JSON.
    - No explanations.

    FORMAT:

    {{
        "week_1": {{
            "focus": "",
            "tasks": [],
            "project": "",
            "checkpoint": ""
        }},
        "week_2": {{
            "focus": "",
            "tasks": [],
            "project": "",
            "checkpoint": ""
        }},
        "week_3": {{
            "focus": "",
            "tasks": [],
            "project": "",
            "checkpoint": ""
        }},
        "week_4": {{
            "focus": "",
            "tasks": [],
            "project": "",
            "checkpoint": ""
        }}
    }}
    """

    response = call_llm(prompt, temperature=0.2)

    try:
        plan = parse_llm_json(response)

        # Hard constraint: keep only first 4 weeks
        allowed_weeks = ["week_1", "week_2", "week_3", "week_4"]
        cleaned_plan = {k: plan[k] for k in allowed_weeks if k in plan}

        return cleaned_plan

    except ValueError:
        return {"error": "Invalid JSON from LLM", "raw_output": response}
