# -----------------------------
# Weighted Gap & Alignment Engine
# -----------------------------

# Weight configuration
WEIGHTS = {
    "technical": 0.6,
    "tools": 0.25,
    "soft": 0.15
}


def calculate_alignment(user_skills, role_skills):
    """
    Calculate weighted alignment percentage between user and role.
    """

    # Technical
    tech_match = len(set(user_skills["technical"]) & set(role_skills["technical"]))
    tech_total = len(role_skills["technical"])

    # Tools
    tool_match = len(set(user_skills["tools"]) & set(role_skills["tools"]))
    tool_total = len(role_skills["tools"])

    # Soft
    soft_match = len(set(user_skills["soft"]) & set(role_skills["soft"]))
    soft_total = len(role_skills["soft"])

    # Safe division
    tech_ratio = tech_match / tech_total if tech_total else 0
    tool_ratio = tool_match / tool_total if tool_total else 0
    soft_ratio = soft_match / soft_total if soft_total else 0

    # Weighted scoring
    alignment_score = (
        tech_ratio * WEIGHTS["technical"] +
        tool_ratio * WEIGHTS["tools"] +
        soft_ratio * WEIGHTS["soft"]
    )

    return round(alignment_score * 100, 2)


def identify_missing_skills(user_skills, role_skills):
    """
    Identify missing skills in each category.
    """

    missing_technical = list(
        set(role_skills["technical"]) - set(user_skills["technical"])
    )

    missing_tools = list(
        set(role_skills["tools"]) - set(user_skills["tools"])
    )

    missing_soft = list(
        set(role_skills["soft"]) - set(user_skills["soft"])
    )

    return {
        "missing_technical": missing_technical,
        "missing_tools": missing_tools,
        "missing_soft": missing_soft
    }


def calculate_readiness_estimate(alignment_score):
    """
    Rough readiness estimation logic.
    Lower alignment → more estimated learning days.
    """

    if alignment_score >= 80:
        return "Job-ready in ~30 days"
    elif alignment_score >= 60:
        return "Job-ready in ~60 days"
    elif alignment_score >= 40:
        return "Job-ready in ~90 days"
    else:
        return "Needs strong foundation (120+ days)"
