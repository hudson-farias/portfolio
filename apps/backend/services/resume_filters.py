from typing import Optional

from services.resume_sections import parse_csv_ids, parse_csv_slugs


def skill_matches_filter(skill, sections: set[str], skill_ids: set[int]):
    if skill.id in skill_ids: return True
    if not sections: return True
    if 'skills' in sections: return True
    return False


def experience_matches_filter(experience_id: int, experience_ids: set[int]):
    if not experience_ids: return True
    return experience_id in experience_ids


def tool_matches_filter(tool_id: int, tool_ids: set[int]):
    if not tool_ids: return True
    return tool_id in tool_ids


def framework_matches_filter(framework_id: int, framework_ids: set[int], language_ids: set[int]):
    # language_ids só filtra chips na UI; no CV entram frameworks só por framework_ids (ou currículo completo).
    if framework_ids: return framework_id in framework_ids
    if language_ids: return False
    return True


def database_matches_filter(database_id: int, database_ids: set[int], sections: set[str]):
    if database_id in database_ids: return True
    if not database_ids:
        if not sections: return True
        if 'databases' in sections: return True
    return False


def parse_resume_query(sections: Optional[str] = None, skill_ids: Optional[str] = None, tool_ids: Optional[str] = None, experience_ids: Optional[str] = None, framework_ids: Optional[str] = None, language_ids: Optional[str] = None, database_ids: Optional[str] = None, include_tools: bool = False, include_summary: bool = True, portfolio_url: Optional[str] = None):
    return {
        'sections': parse_csv_slugs(sections),
        'skill_ids': parse_csv_ids(skill_ids),
        'tool_ids': parse_csv_ids(tool_ids),
        'experience_ids': parse_csv_ids(experience_ids),
        'framework_ids': parse_csv_ids(framework_ids),
        'language_ids': parse_csv_ids(language_ids),
        'database_ids': parse_csv_ids(database_ids),
        'include_tools': include_tools or bool(parse_csv_ids(tool_ids)),
        'include_summary': include_summary,
        'portfolio_url': portfolio_url,
    }


def experience_roles_map(experience_roles = None):
    mapping = {}
    for item in experience_roles or []:
        try:
            experience_id = int(item.experience_id if hasattr(item, 'experience_id') else item.get('experience_id'))
            role_id = int(item.role_id if hasattr(item, 'role_id') else item.get('role_id'))
        except (TypeError, ValueError, AttributeError):
            continue
        mapping[experience_id] = role_id
    return mapping


def header_role_ids_list(header_role_ids = None):
    result = []
    seen = set()
    for item in header_role_ids or []:
        try:
            value = int(item)
        except (TypeError, ValueError):
            continue
        if value in seen:
            continue
        seen.add(value)
        result.append(value)
    return result


def filters_from_resume_body(sections = None, skill_ids = None, tool_ids = None, experience_ids = None, framework_ids = None, language_ids = None, database_ids = None, include_tools: bool = False, include_summary: bool = True, summary: Optional[str] = None, experience_roles = None, header_role_ids = None, portfolio_url: Optional[str] = None):
    tool_id_set = set(tool_ids or [])
    return {
        'sections': set(sections or []),
        'skill_ids': set(skill_ids or []),
        'tool_ids': tool_id_set,
        'experience_ids': set(experience_ids or []),
        'framework_ids': set(framework_ids or []),
        'language_ids': set(language_ids or []),
        'database_ids': set(database_ids or []),
        'include_tools': include_tools or bool(tool_id_set),
        'include_summary': include_summary,
        'summary': summary,
        'experience_roles': experience_roles_map(experience_roles),
        'header_role_ids': header_role_ids_list(header_role_ids),
        'portfolio_url': portfolio_url,
    }
