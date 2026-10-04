from pathlib import Path
from typing import Optional


PROMPTS_ROOT = Path(__file__).resolve().parent


def render_prompt(text: str, variables: Optional[dict] = None):
    result = text
    for key, value in (variables or {}).items():
        result = result.replace('{{' + key + '}}', str(value))
    return result


def load_prompt(relative: str, variables: Optional[dict] = None):
    path = PROMPTS_ROOT / relative
    text = path.read_text(encoding = 'utf-8')
    return render_prompt(text, variables)


def load_pair(relative_dir: str, variables: Optional[dict] = None):
    system = load_prompt(f'{relative_dir}/system.txt', variables)
    user = load_prompt(f'{relative_dir}/user.txt', variables)
    return system, user
