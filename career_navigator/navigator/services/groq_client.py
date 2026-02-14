import os
import re
import json
import ast
from pathlib import Path
import requests
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


def _get_groq_client():
    _load_env()
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    return Groq(api_key=api_key)


def _get_gemini_key():
    _load_env()
    return os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")


def _strip_code_fences(text):
    cleaned = (text or "").strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z0-9_-]*\n", "", cleaned)
        cleaned = re.sub(r"\n```$", "", cleaned)
    return cleaned.strip()


def _extract_gemini_text(response_json):
    candidates = response_json.get("candidates") or []
    if not candidates:
        raise ValueError("Gemini returned no candidates")
    content = (candidates[0] or {}).get("content") or {}
    parts = content.get("parts") or []
    text = "".join((part or {}).get("text", "") for part in parts)
    if not text:
        raise ValueError("Gemini returned empty content")
    return _strip_code_fences(text)


def parse_llm_json(response_text):
    cleaned = _strip_code_fences(response_text)

    candidates = [cleaned]
    fenced_blocks = re.findall(r"```(?:json)?\s*([\s\S]*?)\s*```", response_text or "", flags=re.IGNORECASE)
    candidates.extend(block.strip() for block in fenced_blocks if block and block.strip())

    json_objects = re.findall(r"\{[\s\S]*\}", cleaned)
    candidates.extend(obj.strip() for obj in json_objects if obj and obj.strip())

    if cleaned.startswith("[") and cleaned.endswith("]"):
        candidates.append(cleaned)

    for candidate in candidates:
        if not candidate:
            continue

        normalized = candidate.strip()
        normalized = normalized.replace("\u201c", '"').replace("\u201d", '"').replace("\u2018", "'").replace("\u2019", "'")
        normalized = re.sub(r",\s*([}\]])", r"\1", normalized)

        try:
            return json.loads(normalized)
        except json.JSONDecodeError:
            pass

        try:
            parsed = ast.literal_eval(normalized)
            if isinstance(parsed, (dict, list)):
                return parsed
        except (SyntaxError, ValueError):
            pass

    raise ValueError("Invalid JSON from LLM")


def _call_gemini(prompt, temperature):
    api_key = _get_gemini_key()
    if not api_key:
        raise ValueError("GEMINI_API_KEY not configured")

    model_candidates = []
    configured_model = os.getenv("GEMINI_MODEL")
    if configured_model:
        model_candidates.append(configured_model)
    model_candidates.extend([
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
    ])

    payload = {
        "contents": [{"parts": [{"text": "You are a structured AI engine. Return only valid JSON. No explanations.\n\n" + prompt}]}],
        "generationConfig": {
            "temperature": temperature,
            "responseMimeType": "application/json",
        },
    }

    last_error = "Unknown Gemini error"
    for model in model_candidates:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        response = requests.post(url, json=payload, timeout=45)
        if response.ok:
            return _extract_gemini_text(response.json())
        last_error = f"model={model}, status={response.status_code}, body={response.text[:200]}"
        if response.status_code not in (400, 404):
            break

    raise ValueError(f"Gemini API error: {last_error}")

def call_llm(prompt, temperature=0.3):
    """
    Central LLM call function (Gemini first, then Groq fallback)
    """

    try:
        return _call_gemini(prompt, temperature)
    except Exception as gemini_error:
        groq_client = _get_groq_client()
        if not groq_client:
            raise ValueError(str(gemini_error))

    request_payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": "You are a structured AI engine. Return only valid JSON. No explanations."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": temperature,
    }

    try:
        response = groq_client.chat.completions.create(
            **request_payload,
            response_format={"type": "json_object"},
        )
    except Exception:
        response = groq_client.chat.completions.create(**request_payload)

    return response.choices[0].message.content


def call_groq(prompt, temperature=0.3):
    return call_llm(prompt, temperature)