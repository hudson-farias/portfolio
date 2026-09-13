# Exemplos

`$API` = base resolvida (a que passou em `/health`). `$TOKEN` = `ADMIN_API_KEY` já em variável de shell. Não ecoe `$TOKEN`. Não copie segredo para estes exemplos. Não mostre como assinar JWT.

## Listar skills

```bash
curl -sS -H "Authorization: Bearer $TOKEN" "$API/admin/skills"
```

Esperado: 200 e corpo `{ "skills": [ ... ] }`.

## Criar experiência

Cargo e frameworks vêm de GET anteriores. `role_id` e `framework_ids` têm de existir.

```bash
curl -sS -D - -o /tmp/admin-exp.json \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X POST "$API/admin/experiences" \
  -d '{
    "company": "Exemplo",
    "role_id": 1,
    "contract_type": "PJ",
    "live_url": null,
    "hidden": false,
    "framework_ids": [1],
    "translations": {
      "pt": { "period": "2024 — atual", "description": "Texto em português." },
      "en": { "period": "2024 — present", "description": "English text." }
    }
  }'
```

Esperado: **201** e lista em `experiences`. Pegue o maior `id` e confira:

```bash
curl -sS -H "Authorization: Bearer $TOKEN" "$API/admin/experiences/ID"
```

Esperado: 200, `company` igual a `Exemplo`.

## Atualizar skill (GET + PUT completo)

```bash
curl -sS -H "Authorization: Bearer $TOKEN" "$API/admin/skills/ID"
```

Monte o body com `name` e `icon` (os dois obrigatórios). Não mande `id`.

```bash
curl -sS -D - \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -X PUT "$API/admin/skills/ID" \
  -d '{ "name": "Novo nome", "icon": "api" }'
```

Esperado: 201. Depois `GET "$API/admin/skills/ID"` → 200 e `name` igual a `Novo nome`.

Delete só depois de o usuário confirmar. Aí `DELETE "$API/admin/skills/ID"` (201) e GET do mesmo id → 404.
