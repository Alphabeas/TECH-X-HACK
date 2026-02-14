import os
from dotenv import load_dotenv
from groq import Groq

# Load environment variables
load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env file")

client = Groq(api_key=api_key)

def call_groq(prompt, temperature=0.3):
    """
    Central Groq call function
    """

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
exit