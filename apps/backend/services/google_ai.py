import asyncio

from litellm import acompletion
from litellm.exceptions import APIError, AuthenticationError, BadRequestError, NotFoundError, RateLimitError, ServiceUnavailableError

from env import GEMINI_API_KEY, GEMINI_MODEL


DEFAULT_MODEL = 'gemini/gemini-3.8-flash'
MAX_ATTEMPTS = 3
RETRY_BASE_SECONDS = 0.8


def normalize_model(model: str):
    value = (model or '').strip() or DEFAULT_MODEL
    if '/' not in value:
        return f'gemini/{value}'
    return value


class GoogleAI:
    def __init__(self):
        self.api_key = (GEMINI_API_KEY or '').strip()
        self.model = normalize_model(GEMINI_MODEL or '')


    async def complete(self, system: str, user: str):
        if not self.api_key:
            raise RuntimeError('GEMINI_API_KEY não configurada.')

        response = None
        last_retryable = None

        for attempt in range(MAX_ATTEMPTS):
            try:
                response = await acompletion(
                    model = self.model,
                    api_key = self.api_key,
                    messages = [
                        {'role': 'system', 'content': system},
                        {'role': 'user', 'content': user},
                    ],
                    reasoning_effort = 'none',
                )
                break
            except AuthenticationError as exc:
                raise RuntimeError(self._format_error(exc, 'Autenticação Gemini falhou. Verifique GEMINI_API_KEY.')) from exc
            except NotFoundError as exc:
                raise RuntimeError(self._format_error(exc, f'Modelo Gemini não encontrado: {self.model}.')) from exc
            except BadRequestError as exc:
                raise RuntimeError(self._format_error(exc, 'Requisição inválida à API Gemini.')) from exc
            except RateLimitError as exc:
                raise RuntimeError(self._format_error(exc, 'Limite de uso da API Gemini atingido.')) from exc
            except ServiceUnavailableError as exc:
                last_retryable = exc
                if attempt + 1 >= MAX_ATTEMPTS:
                    raise RuntimeError(self._format_error(exc, 'Falha ao consultar a API Gemini.')) from exc
                await asyncio.sleep(RETRY_BASE_SECONDS * (attempt + 1))
            except APIError as exc:
                raise RuntimeError(self._format_error(exc, 'Falha ao consultar a API Gemini.')) from exc
            except Exception as exc:
                raise RuntimeError(self._format_error(exc, 'Falha inesperada ao consultar a IA.')) from exc

        if response is None:
            raise RuntimeError(self._format_error(last_retryable, 'Falha ao consultar a API Gemini.') if last_retryable else 'Falha ao consultar a API Gemini.')

        choices = getattr(response, 'choices', None) or []
        if not choices:
            raise RuntimeError('Resposta vazia da API Gemini.')

        message = choices[0].message
        text = self._message_text(getattr(message, 'content', None))
        if not text:
            raise RuntimeError('Resposta vazia da API Gemini.')

        return text


    def _message_text(self, content):
        if isinstance(content, str):
            return content.strip()

        if isinstance(content, list):
            parts = []
            for item in content:
                if isinstance(item, str):
                    parts.append(item)
                    continue
                if isinstance(item, dict):
                    text = item.get('text') or item.get('content')
                    if isinstance(text, str):
                        parts.append(text)
                        continue
                text = getattr(item, 'text', None)
                if isinstance(text, str):
                    parts.append(text)
            return ''.join(parts).strip()

        return ''


    def _format_error(self, exc: Exception, fallback: str):
        status = getattr(exc, 'status_code', None)
        raw = getattr(exc, 'message', None) or str(exc) or ''
        message = self._sanitize(str(raw)).split('\n')[0].strip()
        if len(message) > 280:
            message = message[:280] + '...'

        if status and message:
            return f'{fallback} (status {status}: {message})'
        if status:
            return f'{fallback} (status {status})'
        if message and message != fallback:
            return f'{fallback} ({message})'
        return fallback


    def _sanitize(self, text: str):
        cleaned = text
        if self.api_key:
            cleaned = cleaned.replace(self.api_key, '[REDACTED]')
        return cleaned
