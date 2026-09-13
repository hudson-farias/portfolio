from datetime import datetime, timezone
from hashlib import sha256
from secrets import compare_digest

from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

import httpx

from database.api_keys import ApiKeysORM
from env import AUTH_SERVICE_URL

router = APIRouter(prefix = '/admin', tags = ['admin'])

AUTH_COOKIE = 'ACCESS_TOKEN_ADMIN'
_bearer = HTTPBearer(auto_error = False)


def _verify_headers(request: Request, auth: Optional[HTTPAuthorizationCredentials]):
    headers = {}
    token = request.cookies.get(AUTH_COOKIE)

    if token: headers['Cookie'] = f'{AUTH_COOKIE}={token}'
    elif auth and auth.credentials: headers['Authorization'] = f'Bearer {auth.credentials}'

    return headers


async def _auth_service_valid(request: Request, auth: Optional[HTTPAuthorizationCredentials]):
    base = (AUTH_SERVICE_URL or '').rstrip('/')
    if not base:
        return False

    headers = _verify_headers(request, auth)
    if not headers:
        return False

    try:
        async with httpx.AsyncClient(timeout = 5.0) as client:
            response = await client.get(f'{base}/verify', headers = headers)
    except httpx.HTTPError:
        return False

    return response.status_code == 204


def _is_api_key(auth: Optional[HTTPAuthorizationCredentials]):
    return bool(auth and auth.credentials and auth.credentials.startswith('pf_'))


def _key_hash(token: str):
    return sha256(token.encode('utf-8')).hexdigest()


async def _api_key_valid(token: str):
    digest = _key_hash(token)

    try:
        async with ApiKeysORM() as orm:
            row = await orm.find_one(key_hash = digest, revoked_at = None)
    except Exception:
        return False

    stored = row.key_hash if row else ('0' * len(digest))

    try:
        matched = compare_digest(stored, digest)
    except Exception:
        return False

    if not row or not matched:
        return False

    try:
        async with ApiKeysORM() as orm:
            await orm.update(id = row.id, last_used_at = datetime.now(timezone.utc))
    except Exception:
        pass

    return True


async def partial_authenticated(request: Request, auth: Optional[HTTPAuthorizationCredentials] = Depends(_bearer)):
    if _is_api_key(auth):
        return await _api_key_valid(auth.credentials)

    return await _auth_service_valid(request, auth)


async def has_authenticated(request: Request, auth: Optional[HTTPAuthorizationCredentials] = Depends(_bearer)):
    is_auth = await partial_authenticated(request, auth)
    if not is_auth: raise HTTPException(status_code = 498, detail = 'Token invalid')
    return True
