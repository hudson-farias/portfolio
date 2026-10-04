from fastapi import Depends, Query

from routers.landpage import router, Locale
from routers.admin import partial_authenticated

from database.roles import RolesORM
from models.landpage.roles import Role, RolesResponse


async def load_roles(is_auth: bool):
    async with RolesORM() as orm:
        if is_auth:
            roles = await orm.find_many()
        else:
            roles = await orm.find_many(show = True, active = True)

    roles.sort(key = lambda role: (role.sort_order, role.id))
    return roles


def role_to_model(role, locale: str):
    picked = [t for t in role.translations if t.locale == locale]
    if not picked:
        picked = [t for t in role.translations if t.locale == 'pt']
    translation = picked[0] if picked else None

    return Role(
        id = role.id,
        title = translation.title or '' if translation else '',
        category = role.category,
        seniority = role.seniority,
        show = role.show,
        featured = role.featured,
        active = role.active,
        sort_order = role.sort_order,
        color = role.color,
        icon = role.icon,
    )


@router.get('/roles', status_code = 200, response_model = RolesResponse)
async def get_roles(locale: Locale = Query(default = 'pt'), is_auth: bool = Depends(partial_authenticated)):
    roles = await load_roles(is_auth)
    return RolesResponse(roles = [role_to_model(role, locale) for role in roles])
