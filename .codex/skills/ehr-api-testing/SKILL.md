---
name: ehr-api-testing
description: Plan, write, and review tests for the EHR API Dev repository. Use when Codex needs to create or update unit, integration, end-to-end, frontend, API, performance, security, regression, smoke, or acceptance test assets for this Express-based EHR API and its JWT-protected patient summary workflow.
---

# EHR API Testing

Use this skill when the task is primarily about testing, QA documentation, or prompt-driven test generation for `EHR-API-Dev`.

## Start Here

Read these files first when orienting to the test surface:

- `tests/README.md`
- `tests/test-case.md`
- `src/routes/index.js`
- `tests/integration/auth.test.js`
- `tests/integration/summary.test.js`

Then load only the files relevant to the testing task.

## Current Test Surface

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/patients/:patientId/summary`
- Frontend sign-in flow
- Frontend summary rendering flow
- JWT protection and token handling

## Working Rules

- Keep tests aligned with the currently implemented routes, not future roadmap items.
- Prefer updating existing auth and summary tests before creating overlapping duplicates.
- When writing QA docs, match the implemented MVP behavior and seeded demo data.
- Preserve the current Node test style unless the repo explicitly adopts another framework.
- Treat the hidden-JWT UI behavior as a regression-sensitive security requirement.

## Common Task Patterns

### Add or update backend tests

1. Inspect the relevant route, controller, and service.
2. Review existing tests under `tests/integration/` and `tests/e2e/`.
3. Extend the smallest existing suite that covers the changed behavior.
4. Verify seeded credentials and patient IDs still match the fixtures.

### Add or update QA documentation

Inspect:

- `tests/README.md`
- `tests/test-case.md`
- `README.md`
- `SRS_EHR_API.md`

Document only what is real in the current app: health, login, auth protection, and patient summary retrieval.

### Review testing gaps

Prioritize:

- Authentication failures
- Protected-route enforcement
- Summary payload structure
- Frontend sign-in and summary visibility
- Regression coverage for hidden token handling

## Validation

After test or QA changes, prefer checking:

```bash
npm test
```

If the sandbox blocks test execution, note that explicitly and still validate the docs or test wiring against source files.
