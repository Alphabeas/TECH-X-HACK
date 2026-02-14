from .gap_analyzer import calculate_alignment, identify_missing_skills
from .skill_mapper import normalize_skills
from .planner import generate_30_day_plan


def evaluate_progress(
    completed_skills,
    current_user_skills,
    role_skills
):
    """
    Evaluate user progress after completing some skills.
    """

    # Add completed skills to user profile
    updated_user = {
        "technical": list(set(current_user_skills["technical"] + completed_skills)),
        "tools": current_user_skills["tools"],
        "soft": current_user_skills["soft"]
    }

    # Normalize again
    normalized_user = {
        "technical": normalize_skills(updated_user["technical"]),
        "tools": normalize_skills(updated_user["tools"]),
        "soft": normalize_skills(updated_user["soft"])
    }

    normalized_role = {
        "technical": normalize_skills(role_skills["technical"]),
        "tools": normalize_skills(role_skills["tools"]),
        "soft": normalize_skills(role_skills["soft"])
    }

    # Recalculate alignment
    new_alignment = calculate_alignment(normalized_user, normalized_role)

    # Identify new missing skills
    new_missing = identify_missing_skills(normalized_user, normalized_role)

    return {
        "updated_alignment": new_alignment,
        "remaining_missing_skills": new_missing
    }



def adaptive_replan(
    completed_skills,
    current_user_skills,
    role_skills,
    experience_level="Intermediate"
):
    """
    Full adaptive loop:
    Evaluate progress → Recalculate alignment → Generate new plan
    """

    evaluation = evaluate_progress(
        completed_skills,
        current_user_skills,
        role_skills
    )

    new_alignment = evaluation["updated_alignment"]
    remaining_missing = evaluation["remaining_missing_skills"]

    new_plan = generate_30_day_plan(
        remaining_missing,
        experience_level=experience_level
    )

    return {
        "new_alignment": new_alignment,
        "remaining_missing": remaining_missing,
        "updated_roadmap": new_plan
    }

