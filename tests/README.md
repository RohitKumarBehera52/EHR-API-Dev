# Testing Prompts For The EHR API Stack

This directory documents the second pass: how to generate test cases, prompts, or test-writing tasks that cover every major testing prism relevant to the EHR API MVP.

The current application scope is centered on:

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/patients/:patientId/summary`
- Frontend sign-in and summary retrieval
- JWT-protected access to patient data

Use this file as a prompt bank for Codex, QA writers, automation engineers, or anyone drafting deeper test suites.

For structured QA-style case definitions, also see [test-case.md](/c:/Users/2000115835/Documents/Codex/EHR-API-Dev/tests/test-case.md).

---

## 1. Unit testing

- Focus: isolate single functions or small logic units such as auth validation, token utilities, password comparison, or summary shaping helpers without depending on the full network flow.
- Prompt: "Write Node test cases for `src/utils/token.util.js` that sign an access token, verify it successfully, and reject a malformed token."
- Alternative: "Create unit tests for the login validation logic to cover missing username, missing password, and valid credential payloads."

## 2. Integration testing

- Focus: Express routes working together with controllers, services, repositories, and JSON-backed persistence.
- Prompt: "Using Supertest, implement integration tests that POST `/api/auth/login`, capture the access token, then GET `/api/patients/PAT-1001/summary` to verify the consolidated summary shape."
- Option: "Write a Node test suite that confirms `GET /api/patients/:patientId/summary` returns `401` without a bearer token and `200` with a valid token."

## 3. End-to-end testing

- Focus: full user story including frontend sign-in, backend authentication, and patient summary rendering.
- Prompt: "Draft a Playwright test where the user opens the EHR demo, signs in with `doctor.demo`, loads patient `PAT-1001`, and verifies that all summary cards become visible."
- Option: "Create a Cypress script that signs in through the UI and asserts that demographics, encounters, diagnoses, medications, allergies, labs, and imaging sections render after success."

## 4. Front-end testing

- Focus: frontend behavior, visible state changes, and client-side handling of auth and summary loading.
- Prompt: "Generate frontend tests that verify: (a) the password field masks input, (b) summary cannot load before sign-in, and (c) successful sign-in updates the authentication status."
- Option: "Write DOM-oriented tests that confirm the JWT is not rendered in the UI after login and the summary section stays hidden until the fetch succeeds."

## 5. API testing

- Focus: contract-level behavior of the Node and Express server.
- Prompt: "Write Postman or Newman checks validating that `GET /api/health` returns a healthy JSON payload, `POST /api/auth/login` returns a bearer token for valid credentials, and `GET /api/patients/:patientId/summary` returns `404` for an unknown patient."
- Option: "Describe schema assertions for the summary endpoint so the response must include `demographics`, `latestEncounters`, `diagnoses`, `activeMedications`, `allergies`, `recentLabResults`, and `imagingReferences`."

## 6. Performance testing

- Focus: response time, repeated authenticated access, and stability under normal local load.
- Prompt: "Suggest a k6 script that logs in once, reuses the bearer token, and sends repeated `GET /api/patients/PAT-1001/summary` requests while measuring average and 95th percentile latency."
- Alternative: "Use Artillery to run 100 requests against `GET /api/health` and fail the scenario if median response time exceeds 150 ms in a local environment."

## 7. Security testing

- Focus: authentication enforcement, invalid token handling, and safe rendering of response content.
- Prompt: "Describe security tests that verify protected patient summary routes reject missing, malformed, or expired bearer tokens with `401` responses."
- Option: "Propose a test plan for verifying script-like input from backend summary fields is rendered safely in the frontend and does not execute as HTML or JavaScript."

## 8. Regression testing

- Focus: catch new bugs after backend or frontend updates.
- Prompt: "Create a regression suite that replays health check, login, protected summary access, and frontend summary rendering after each UI or API change."
- Option: "Outline a CI-friendly regression job that runs `npm test` and tags auth and summary tests as core MVP coverage."

## 9. Smoke testing

- Focus: quick sanity checks before deeper suites begin.
- Prompt: "List shell commands or HTTP checks that confirm the EHR API starts correctly, such as `GET /api/health`, valid login, and one authenticated summary request."
- Option: "Script a lightweight smoke test that starts the app, confirms the frontend page loads, and verifies the login form and patient summary controls are visible."

## 10. Acceptance testing

- Focus: business-level MVP behavior for secure patient-summary access.
- Prompt: "Write an acceptance scenario describing how an authorized clinician signs in and retrieves a consolidated patient summary without seeing the JWT exposed in the interface."
- Option: "Draft a QA checklist proving the MVP requirements are met: service health, successful sign-in, protected patient data, summary visibility, and secure token handling."
