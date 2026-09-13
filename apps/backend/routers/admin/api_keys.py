from datetime import datetime, timezone
from hashlib import sha256
from secrets import token_urlsafe

from fastapi import Depends, HTTPException
from typing import List

from database.api_keys import ApiKeysORM
from models.admin.api_keys import ApiKey, ApiKeyCreated, ApiKeyDTO
from routers.admin import has_authenticated, router


def api_key_data(row):
    return ApiKey(
        id = row.id,
        name = row.name,
        key_prefix = row.key_prefix,
        created_at = row.created_at,
        last_used_at = row.last_used_at,
        revoked = row.revoked_at is not None,
    )


async def response_data():
    async with ApiKeysORM() as orm:
        rows = await orm.find_many()

    return [api_key_data(row) for row in rows]


@router.get('/api_keys', status_code = 200, response_model = List[ApiKey])
async def get_api_keys(_: bool = Depends(has_authenticated)):
    return await response_data()


@router.post('/api_keys', status_code = 201, response_model = ApiKeyCreated)
async def post_api_key(params: ApiKeyDTO, _: bool = Depends(has_authenticated)):
    plaintext = f'pf_{token_urlsafe(32)}'
    key_hash = sha256(plaintext.encode('utf-8')).hexdigest()

    async with ApiKeysORM() as orm:
        await orm.create(
            name = params.name,
            key_prefix = plaintext[:8],
            key_hash = key_hash,
            created_at = datetime.now(timezone.utc),
        )
        row = await orm.find_one(key_hash = key_hash)

    if not row:
        raise HTTPException(status_code = 500, detail = 'Não foi possível criar a chave.')

    created = api_key_data(row)
    return ApiKeyCreated(
        key = plaintext,
        id = created.id,
        name = created.name,
        key_prefix = created.key_prefix,
        created_at = created.created_at,
        last_used_at = created.last_used_at,
        revoked = created.revoked,
    )


@router.delete('/api_keys/{api_key_id}', status_code = 201, response_model = List[ApiKey])
async def delete_api_key(api_key_id: int, _: bool = Depends(has_authenticated)):
    async with ApiKeysORM() as orm:
        row = await orm.find_one(id = api_key_id)

    if not row:
        raise HTTPException(status_code = 404, detail = 'Chave de API não encontrada.')

    if row.revoked_at is None:
        async with ApiKeysORM() as orm:
            await orm.update(id = api_key_id, revoked_at = datetime.now(timezone.utc))

    return await response_data()
