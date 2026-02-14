import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

def _load_env():
    for env_path in [
        Path(__file__).resolve().parents[2] / ".env",
        Path(__file__).resolve().parents[3] / ".env",
    ]:
        if env_path.exists():
            load_dotenv(dotenv_path=env_path)
    load_dotenv()


def _get_client():
    _load_env()
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)

def call_groq(prompt, temperature=0.3):
    """
    Central Groq call function
    """

    client = _get_client()
    if not client:
        raise ValueError("GROQ_API_KEY not configured. Set GROQ_API_KEY in career_navigator/.env")

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",

        messages=[
            {
                "role": "system",
                "content": "You are a structured AI engine. Return only valid JSON. No explanations."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=temperature,
    )

    return response.choices[0].message.content