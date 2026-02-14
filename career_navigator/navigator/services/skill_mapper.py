# Simple skill normalization map

SKILL_MAP = {
    "REST API": "REST",
    "REST APIs": "REST",
    "RESTful Services": "REST",
    "JS": "JavaScript",
    "Py": "Python",
    "Tensorflow": "TensorFlow",
}


def normalize_skills(skill_list):
    normalized = []

    for skill in skill_list:
        skill = skill.strip()
        normalized.append(SKILL_MAP.get(skill, skill))

    return list(set(normalized))
