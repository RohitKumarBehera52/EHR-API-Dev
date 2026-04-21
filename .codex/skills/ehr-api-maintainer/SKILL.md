---
name: ehr-api-maintainer
description: Maintain and extend the EHR API Dev repository. Use when Codex needs to work on this Express-based Electronic Health Record API, especially for authenticated routes, patient summary aggregation, JSON-backed repositories, Swagger updates, test fixes, or requirements alignment with SRS_EHR_API.md.
---

# EHR API Maintainer

Use this skill for work inside the `EHR-API-Dev` repository.

## Start Here

Read these files first when orienting:

- `README.md`
- `SRS_EHR_API.md`
- `src/app.js`
- `src/routes/index.js`

Then load only the files relevant to the task.

## Architecture Map

- `server.js`: process entry point
- `src/app.js`: Express app setup
- `src/routes/`: endpoint registration
- `src/controllers/`: request handlers
- `src/services/`: business logic
- `src/repositories/`: JSON-backed data access
- `src/data/`: persisted local data
- `src/middleware/`: auth, validation, error handling
- `tests/`: integration and end-to-end coverage

## Working Rules

- Follow the existing CommonJS style.
- Prefer minimal edits within the current architecture.
- Put endpoint behavior in services, not routes.
- Keep response shapes consistent with the existing API response helpers.
- Check tests before assuming a route contract.
- Update docs when implemented behavior changes.

## Common Task Patterns

### Add or update an endpoint

1. Inspect `src/routes/index.js` and the target route file.
2. Update or add the controller.
3. Implement logic in the matching service.
4. Extend repositories only if the data-access layer truly needs it.
5. Add or update tests under `tests/integration/` or `tests/e2e/`.

### Change patient summary behavior

Inspect these first:

- `src/services/patients.service.js`
- `src/controllers/patients.controller.js`
- `tests/integration/summary.test.js`
- `src/data/*.json` files used by the summary

Preserve ordering rules and field names unless the task explicitly changes the contract.

### Change authentication behavior

Inspect these first:

- `src/routes/auth.routes.js`
- `src/controllers/auth.controller.js`
- `src/services/auth.service.js`
- `src/middleware/auth/`
- `tests/integration/auth.test.js`

Keep protected-route behavior explicit and retest summary access afterward.

### Update API docs

Inspect:

- `src/docs/`
- `src/config/swagger.config.js`

Only document routes that actually exist in code.

## Validation

After code changes, prefer running:

```bash
npm test
```

If the change affects auth or summaries, pay special attention to:

- `tests/integration/auth.test.js`
- `tests/integration/summary.test.js`

## Scope Awareness

This repo is an MVP foundation, not a full production EHR.

Avoid assuming the existence of:

- Database migrations
- ORM models
- File upload pipelines
- Full RBAC coverage
- Advanced scheduling or billing workflows

Use `SRS_EHR_API.md` to distinguish current implementation from future intent.
