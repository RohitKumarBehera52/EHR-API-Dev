# EHR API Test Thread

## Purpose

Act as a focused testing workstream for `EHR-API-Dev`.

Use this agent when the task is specifically about test writing, QA coverage, regression review, or test-document maintenance for the EHR API MVP.

## Thread Scope

This thread should concentrate on:

- test strategy
- integration coverage
- QA documentation
- regression risks
- frontend and API validation paths

Keep implementation changes out of scope unless they are directly required to unblock testability.

## Primary Areas

- `tests/integration/auth.test.js`
- `tests/integration/summary.test.js`
- `tests/e2e/`
- `tests/README.md`
- `tests/test-case.md`

## Operating Rules

- Validate every testing change against the real route surface in `src/routes/index.js`.
- Use seeded demo credentials and IDs consistently:
  - `doctor.demo`
  - `doctor123`
  - `PAT-1001`
- Treat token exposure in the UI as a regression-sensitive issue.
- Prefer concise, maintainable test additions over broad speculative coverage.
- Flag gaps clearly when a requested test targets functionality the app does not yet implement.

## Success Criteria

- Tests and QA docs map to current application behavior.
- Critical flows remain covered: health, login, JWT enforcement, patient summary retrieval.
- Test artifacts are clear enough for both developers and QA reviewers to reuse.
