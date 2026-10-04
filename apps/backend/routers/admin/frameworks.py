from fastapi import Depends, HTTPException, Query
from routers.admin import router, partial_authenticated, has_authenticated

from database.frameworks import FrameworksORM
from database.language_frameworks import LanguageFrameworksORM
from database.languages import LanguagesORM

from models.admin.frameworks import *
from models.admin.languages import Language

from typing import Dict, List, Optional


def _framework_filters(is_auth: bool, show: Optional[bool] = None):
    filters = {}
    if not is_auth: filters['show'] = True
    elif show is not None: filters['show'] = show
    return filters


async def load_frameworks(is_auth: bool, q: Optional[str] = None, show: Optional[bool] = None):
    async with FrameworksORM() as orm:
        frameworks = await orm.find_filtered(
            q = q.strip() if q else None,
            q_columns = ['name', 'icon', 'scope'],
            **_framework_filters(is_auth, show),
        )

    frameworks.sort(key = lambda framework: (framework.sort_order, framework.id))
    return frameworks


async def load_relations():
    async with LanguageFrameworksORM() as orm: relations = await orm.find_many()

    framework_language_ids: Dict[int, List[int]] = {}
    for relation in relations:
        framework_language_ids.setdefault(relation.framework_id, []).append(relation.language_id)

    async with LanguagesORM() as orm:
        languages = await orm.find_filtered(q_columns = ['name', 'icon'])

    languages.sort(key = lambda language: (language.sort_order, language.id))
    languages_by_id = {language.id: language for language in languages}

    return framework_language_ids, languages_by_id


async def response_data(is_auth: bool, q: Optional[str] = None, show: Optional[bool] = None):
    frameworks = await load_frameworks(is_auth, q, show)
    framework_language_ids, languages_by_id = await load_relations()

    data = []
    for framework in frameworks:
        linked = [
            Language(**languages_by_id[language_id].dict())
            for language_id in framework_language_ids.get(framework.id, [])
            if language_id in languages_by_id
        ]
        linked.sort(key = lambda language: (language.sort_order, language.id))
        data.append(Framework(**framework.dict(), languages = linked))

    return data


async def next_sort_order():
    async with FrameworksORM() as orm: frameworks = await orm.find_many()
    if not frameworks: return 0
    return max(framework.sort_order for framework in frameworks) + 1


async def validate_language_ids(language_ids: List[int]):
    if not language_ids: return

    async with LanguagesORM() as orm: languages = await orm.find_many()
    existing_ids = {language.id for language in languages}
    invalid = set(language_ids) - existing_ids

    if invalid: raise HTTPException(status_code = 400, detail = 'Uma ou mais linguagens informadas não existem.')


async def sync_relations(framework_id: int, language_ids: List[int]):
    async with LanguageFrameworksORM() as orm: await orm.delete(framework_id = framework_id)

    unique_ids = list(dict.fromkeys(language_ids))
    for language_id in unique_ids:
        async with LanguageFrameworksORM() as orm:
            await orm.create(framework_id = framework_id, language_id = language_id)


async def item_data(framework_id: int, is_auth: bool):
    async with FrameworksORM() as orm:
        framework = await orm.find_one(id = framework_id)

    if not framework or (not is_auth and not framework.show):
        raise HTTPException(status_code = 404, detail = 'Framework não encontrado.')

    framework_language_ids, languages_by_id = await load_relations()
    linked = [
        Language(**languages_by_id[language_id].dict())
        for language_id in framework_language_ids.get(framework.id, [])
        if language_id in languages_by_id
    ]
    linked.sort(key = lambda language: (language.sort_order, language.id))
    return Framework(**framework.dict(), languages = linked)


@router.get('/frameworks', status_code = 200, response_model = List[Framework])
async def get(is_auth: bool = Depends(partial_authenticated), q: Optional[str] = Query(None), show: Optional[bool] = Query(None)):
    return await response_data(is_auth, q, show)


@router.get('/frameworks/{framework_id}', status_code = 200, response_model = Framework)
async def get_one(framework_id: int, is_auth: bool = Depends(partial_authenticated)):
    return await item_data(framework_id, is_auth)


@router.put('/frameworks/reorder', status_code = 201, response_model = List[Framework])
async def reorder(params: FrameworkReorderDTO, is_auth: bool = Depends(has_authenticated)):
    async with FrameworksORM() as orm: frameworks = await orm.find_many()

    existing_ids = {framework.id for framework in frameworks}
    if set(params.ids) != existing_ids: raise HTTPException(status_code = 400, detail = 'Informe todos os IDs dos frameworks na nova ordem.')

    async with FrameworksORM() as orm:
        for index, framework_id in enumerate(params.ids): await orm.update(id = framework_id, sort_order = index)

    return await response_data(is_auth)


@router.post('/frameworks', status_code = 201, response_model = List[Framework])
async def post(params: FrameworkWriteDTO, is_auth: bool = Depends(has_authenticated)):
    await validate_language_ids(params.language_ids)

    payload = params.dict()
    language_ids = payload.pop('language_ids', [])
    payload['sort_order'] = await next_sort_order()

    async with FrameworksORM() as orm: await orm.create(**payload)

    async with FrameworksORM() as orm: frameworks = await orm.find_many()
    created = max(frameworks, key = lambda item: item.id) if frameworks else None
    if not created: raise HTTPException(status_code = 500, detail = 'Não foi possível criar o framework.')

    await sync_relations(created.id, language_ids)
    return await response_data(is_auth)


@router.put('/frameworks/{framework_id}', status_code = 201, response_model = List[Framework])
async def put(framework_id: int, params: FrameworkWriteDTO, is_auth: bool = Depends(has_authenticated)):
    async with FrameworksORM() as orm: current = await orm.find_one(id = framework_id)
    if not current: raise HTTPException(status_code = 404, detail = 'Framework não encontrado.')

    await validate_language_ids(params.language_ids)

    payload = params.dict()
    language_ids = payload.pop('language_ids', [])
    payload['sort_order'] = current.sort_order

    async with FrameworksORM() as orm: await orm.update(id = framework_id, **payload)
    await sync_relations(framework_id, language_ids)
    return await response_data(is_auth)


@router.delete('/frameworks/{framework_id}', status_code = 201, response_model = List[Framework])
async def delete(framework_id: int, is_auth: bool = Depends(has_authenticated)):
    async with FrameworksORM() as orm: await orm.delete(id = framework_id)
    return await response_data(is_auth)
