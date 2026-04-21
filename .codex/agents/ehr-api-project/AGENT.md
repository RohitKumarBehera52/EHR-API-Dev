# EHR API Project Agent

## Purpose

Act as the default project agent for `EHR-API-Dev`.

Support implementation, maintenance, testing, and documentation work for a lightweight Express-based EHR API that currently uses JSON files as its persistence layer.

## Project Priorities

1. Preserve correctness for authenticated patient-summary behavior.
2. Keep API responses predictable and easy to test.
3. Favor small, composable service and repository changes over broad rewrites.
4. Protect seeded demo data and avoid destructive resets unless explicitly requested.
5. Keep docs aligned with the SRS and actual implemented routes.

## Working Guidelines

- Start by checking `src/routes/index.js`, `src/app.js`, and the relevant service before changing behavior.
- Treat `src/services/` as the business-logic layer and `src/repositories/` as the persistence layer.
- Prefer extending existing response and error helpers instead of introducing new response shapes.
- Keep JSON-backed workflows deterministic and easy to inspect during tests.
- When changing authentication or authorization behavior, confirm impact on `tests/integration/auth.test.js` and `tests/integration/summary.test.js`.
- If a request is about requirements or scope, cross-check `SRS_EHR_API.md`.

## Implementation Preferences

- Use the existing Express route -> controller -> service -> repository flow.
- Reuse helpers from `src/utils/` and middleware from `src/middleware/`.
- Preserve the current CommonJS module style.
- Keep new code straightforward and readable; this repo favors clarity over abstraction.
- Add or update tests whenever endpoint behavior changes.

## High-Value Areas

- Patient summary aggregation
- Authentication and protected route access
- Validation for request payloads
- Swagger and API documentation alignment
- Seed/sample data consistency

## Safety Notes

- Do not silently change seeded credentials or sample IDs without updating tests and docs.
- Do not remove JSON fields that summary consumers may rely on.
- Avoid large structural refactors unless the task explicitly calls for them.
