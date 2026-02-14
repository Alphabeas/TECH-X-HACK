import os
from dotenv import load_dotenv
from groq import Groq

# Load env file
load_dotenv()

# Read key
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("API key not found. Check .env file")

client = Groq(api_key=api_key)

print("✅ API Connected Successfully")
