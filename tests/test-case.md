# Test Cases For The EHR API Stack

This document lists sample test cases for the EHR API MVP. The cases are written in a QA and testing-document style so they can be converted into manual tests, automated tests, or Codex prompts.

## Test Environment

- Backend: Node.js API running on `http://localhost:3000`
- Frontend: Static UI served by the same Express app
- Auth route: `POST /api/auth/login`
- Protected route: `GET /api/patients/:patientId/summary`
- Health route: `GET /api/health`
- Test data:
  - Username: `doctor.demo`
  - Password: `doctor123`
  - Patient ID: `PAT-1001`
- Scope: Health check, login, JWT-protected access, consolidated patient summary, frontend behavior, and basic reliability

## 1. Unit Testing

### TC-UNIT-001: Reject Missing Username During Login

- Objective: Confirm login validation or equivalent auth logic rejects a request without a username.
- Preconditions: Auth validation logic or equivalent request validation is available for testing.
- Test Data:
  - `{ username: "", password: "doctor123" }`
  - `{ password: "doctor123" }`
- Steps:
  1. Call the login validation logic with an empty username.
  2. Call the login validation logic with no username field.
- Expected Result:
  - Each invalid payload returns a validation error.
  - No access token is generated.
- Priority: High

### TC-UNIT-002: Reject Missing Password During Login

- Objective: Confirm login validation or equivalent auth logic rejects a request without a password.
- Preconditions: Auth validation logic or equivalent request validation is available for testing.
- Test Data:
  - `{ username: "doctor.demo", password: "" }`
  - `{ username: "doctor.demo" }`
- Steps:
  1. Call the login validation logic with an empty password.
  2. Call the login validation logic with no password field.
- Expected Result:
  - Each invalid payload returns a validation error.
  - No access token is generated.
- Priority: High

### TC-UNIT-003: Verify Access Token Can Be Signed And Verified

- Objective: Confirm JWT utility logic can sign a token and then validate it successfully.
- Preconditions: Token utility functions are available for testing.
- Test Data: `{ sub: "USR-1001", username: "doctor.demo", role: "doctor", providerId: "PROV-1001" }`
- Steps:
  1. Sign an access token with the payload.
  2. Verify the generated token.
  3. Compare the decoded claims to the original payload.
- Expected Result:
  - A JWT string is produced.
  - Verification succeeds for the generated token.
  - Decoded claims include the expected user fields.
- Priority: High

## 2. Integration Testing

### TC-INT-001: Login Returns Bearer Token For Valid Credentials

- Objective: Confirm the backend authenticates a valid user and returns a bearer token payload.
- Preconditions: Backend server is running.
- Test Data: `{ username: "doctor.demo", password: "doctor123" }`
- Steps:
  1. Send `POST /api/auth/login` with the valid payload.
  2. Check the response status and body.
- Expected Result:
  - Status code is `200`.
  - Response body contains `success: true`.
  - Response body contains `accessToken`, `tokenType`, `expiresIn`, and `user`.
  - `tokenType` is `Bearer`.
- Priority: High

### TC-INT-002: Summary Endpoint Requires Authentication

- Objective: Confirm the patient summary route is protected.
- Preconditions: Backend server is running.
- Test Data: `PAT-1001`
- Steps:
  1. Send `GET /api/patients/PAT-1001/summary` without an `Authorization` header.
  2. Inspect the response.
- Expected Result:
  - Status code is `401`.
  - Response body contains `success: false`.
  - No patient summary is returned.
- Priority: High

### TC-INT-003: Login Then Retrieve Consolidated Patient Summary

- Objective: Confirm login and patient summary retrieval work together end-to-end at the API integration level.
- Preconditions: Backend server is running.
- Test Data:
  - Login payload: `{ username: "doctor.demo", password: "doctor123" }`
  - Patient ID: `PAT-1001`
- Steps:
  1. Send `POST /api/auth/login`.
  2. Capture the returned access token.
  3. Send `GET /api/patients/PAT-1001/summary` with `Authorization: Bearer <token>`.
  4. Check the response structure.
- Expected Result:
  - Summary request returns status `200`.
  - Response contains `demographics`, `latestEncounters`, `diagnoses`, `activeMedications`, `allergies`, `recentLabResults`, and `imagingReferences`.
  - `demographics.patientId` equals `PAT-1001`.
- Priority: High

## 3. End-To-End Testing

### TC-E2E-001: Sign In And Load Patient Summary Through The UI

- Objective: Confirm a user can sign in from the frontend and retrieve a patient summary.
- Preconditions:
  - Backend server is running.
  - Frontend is served by the Express app.
- Test Data:
  - Username: `doctor.demo`
  - Password: `doctor123`
  - Patient ID: `PAT-1001`
- Steps:
  1. Open the application in a browser.
  2. Enter valid login credentials.
  3. Click `Sign In Securely`.
  4. Enter or confirm the patient ID.
  5. Click `Load Summary`.
- Expected Result:
  - Authentication status updates to the signed-in user.
  - The patient summary sections appear.
  - Demographics, encounters, diagnoses, medications, allergies, labs, and imaging are visible.
- Priority: High

### TC-E2E-002: Summary Cannot Be Loaded Before Sign-In

- Objective: Confirm the frontend blocks protected summary access before authentication.
- Preconditions:
  - Backend server is running.
  - Frontend is loaded in a browser.
- Test Data: Patient ID `PAT-1001`
- Steps:
  1. Open the application without signing in.
  2. Click `Load Summary`.
- Expected Result:
  - A visible error or guidance message is displayed.
  - Summary sections remain hidden.
  - The page does not crash.
- Priority: High

## 4. Front End Testing

### TC-FE-001: Password Field Masks Input

- Objective: Confirm the sign-in form does not expose the password in plain text.
- Preconditions: Frontend app is running.
- Test Data: `doctor123`
- Steps:
  1. Open the sign-in form.
  2. Type the password value into the password field.
- Expected Result:
  - The password field masks the entered characters.
  - The password is not visibly exposed in the interface.
- Priority: High

### TC-FE-002: JWT Is Not Displayed On Screen After Login

- Objective: Confirm the frontend no longer exposes the JWT token in the UI.
- Preconditions:
  - Frontend and backend are running.
  - Valid login credentials are available.
- Test Data: `{ username: "doctor.demo", password: "doctor123" }`
- Steps:
  1. Sign in using valid credentials.
  2. Inspect the visible UI after successful login.
- Expected Result:
  - Authentication status is shown.
  - No raw JWT token is rendered on screen.
  - No access-token text area or visible token dump appears.
- Priority: High

### TC-FE-003: Summary Sections Render After Successful Fetch

- Objective: Confirm the frontend reveals the summary cards only after a successful response.
- Preconditions:
  - Frontend and backend are running.
  - User is signed in successfully.
- Test Data: Patient ID `PAT-1001`
- Steps:
  1. Load the patient summary.
  2. Observe the summary card section.
- Expected Result:
  - The hidden summary section becomes visible.
  - Cards display populated data instead of a blank state.
- Priority: Medium

## 5. API Testing

### TC-API-001: Health Endpoint Returns Service Status

- Objective: Confirm `GET /api/health` returns a healthy JSON response.
- Preconditions: Backend server is running.
- Steps:
  1. Send `GET /api/health`.
  2. Check the response status and body.
- Expected Result:
  - Status code is `200`.
  - Response body contains `success: true`.
  - Data contains `{ status: "ok" }` or equivalent healthy service status.
- Priority: High

### TC-API-002: Login Rejects Invalid Credentials

- Objective: Confirm the login endpoint rejects an incorrect username or password.
- Preconditions: Backend server is running.
- Test Data:
  - `{ username: "doctor.demo", password: "wrong-password" }`
  - `{ username: "missing.user", password: "doctor123" }`
- Steps:
  1. Send each invalid login payload to `POST /api/auth/login`.
  2. Review the response status and body.
- Expected Result:
  - Each invalid login returns `401`.
  - Response body contains an understandable authentication error.
  - No access token is returned.
- Priority: High

### TC-API-003: Unknown Patient ID Returns 404

- Objective: Confirm the summary endpoint handles a missing patient record correctly.
- Preconditions:
  - Backend server is running.
  - Valid bearer token is available.
- Test Data: `PAT-9999`
- Steps:
  1. Send `GET /api/patients/PAT-9999/summary` with a valid bearer token.
  2. Check the response status and body.
- Expected Result:
  - Status code is `404`.
  - Response body contains a patient-not-found error.
  - No summary payload is returned.
- Priority: High

## 6. Performance Testing

### TC-PERF-001: Health Endpoint Responds Quickly Under Normal Load

- Objective: Confirm the health endpoint remains responsive during repeated checks.
- Preconditions: Backend server is running.
- Load Profile: 100 `GET /api/health` requests
- Steps:
  1. Send 100 requests to `GET /api/health`.
  2. Record response times.
  3. Calculate average and 95th percentile latency.
- Expected Result:
  - Error rate is 0%.
  - Average response time is below 150 ms in a local test environment.
  - 95th percentile response time is below 300 ms in a local test environment.
- Priority: Medium

### TC-PERF-002: Repeated Summary Fetches Remain Stable

- Objective: Confirm repeated authenticated summary requests do not make the app unstable.
- Preconditions:
  - Backend server is running.
  - Valid bearer token is available.
- Load Profile: 25 sequential `GET /api/patients/PAT-1001/summary` requests
- Steps:
  1. Obtain a valid bearer token.
  2. Send 25 summary requests using the same token.
  3. Record status codes and response times.
- Expected Result:
  - Each request returns `200`.
  - Response structure remains consistent.
  - The server remains responsive after the run.
- Priority: Medium

## 7. Security Testing

### TC-SEC-001: Protected Summary Rejects Missing Bearer Token

- Objective: Confirm protected patient data cannot be accessed anonymously.
- Preconditions: Backend server is running.
- Test Data: Patient ID `PAT-1001`
- Steps:
  1. Send `GET /api/patients/PAT-1001/summary` without an `Authorization` header.
  2. Observe the response.
- Expected Result:
  - Status code is `401`.
  - Response clearly indicates authentication is required.
- Priority: High

### TC-SEC-002: Protected Summary Rejects Invalid Or Expired Token

- Objective: Confirm the authentication middleware rejects invalid JWT input.
- Preconditions: Backend server is running.
- Test Data:
  - `Authorization: Bearer invalid-token`
  - `Authorization: Bearer malformed.jwt.value`
- Steps:
  1. Send the summary request with each invalid token.
  2. Check the response status and body.
- Expected Result:
  - Each request returns `401`.
  - Response indicates the token is invalid or expired.
  - No protected patient data is exposed.
- Priority: High

### TC-SEC-003: Script-Like Data Is Rendered Safely In The UI

- Objective: Confirm frontend rendering does not execute script-like content from API data.
- Preconditions:
  - Frontend and backend are running.
  - Test data can include script-like text in a summary field.
- Test Data: Example content such as `<script>alert('xss')</script>` in a rendered field
- Steps:
  1. Introduce or mock script-like text in a displayed summary field.
  2. Load the summary in the browser.
  3. Observe the UI behavior.
- Expected Result:
  - Script-like content is rendered as text or safely handled.
  - No browser alert or script execution occurs.
  - The page remains usable.
- Priority: High

## 8. Regression Testing

### TC-REG-001: Login And Summary Retrieval Still Work After Changes

- Objective: Confirm the core authenticated workflow remains stable after code changes.
- Preconditions:
  - Latest backend and frontend code is running.
  - Valid demo credentials are available.
- Steps:
  1. Log in through the API or UI.
  2. Retrieve the patient summary.
  3. Verify the summary sections are still populated.
- Expected Result:
  - Login still succeeds.
  - Summary retrieval still succeeds.
  - The final displayed data is structurally correct.
- Priority: High

### TC-REG-002: Token Is Still Hidden In The UI After Frontend Changes

- Objective: Confirm the earlier security fix preventing JWT exposure does not regress.
- Preconditions:
  - Latest frontend code is running.
  - Backend is reachable.
- Steps:
  1. Sign in through the UI.
  2. Inspect the interface after successful authentication.
- Expected Result:
  - No visible JWT token appears in the interface.
  - Authenticated summary retrieval still works.
- Priority: High

## 9. Smoke Testing

### TC-SMOKE-001: Backend Starts And Health Check Responds

- Objective: Confirm the backend is available before deeper testing begins.
- Preconditions: Backend dependencies are installed.
- Steps:
  1. Start the backend server.
  2. Send `GET /api/health`.
- Expected Result:
  - Server starts without critical errors.
  - Health endpoint returns status `200`.
- Priority: Critical

### TC-SMOKE-002: Frontend Loads Successfully

- Objective: Confirm the frontend page opens without a blank screen.
- Preconditions:
  - Backend dependencies are installed.
  - Express server is running.
- Steps:
  1. Open the application URL in a browser.
  2. Confirm the page layout renders.
- Expected Result:
  - Page loads successfully.
  - Sign-in and patient summary sections are visible.
  - No critical UI error blocks usage.
- Priority: Critical

### TC-SMOKE-003: Basic Authenticated Summary Flow Works

- Objective: Confirm the most important user journey still works.
- Preconditions:
  - Backend is running.
  - Valid login credentials are available.
- Steps:
  1. Sign in using valid demo credentials.
  2. Load the patient summary for `PAT-1001`.
- Expected Result:
  - User can authenticate successfully.
  - Patient summary loads successfully.
- Priority: Critical

## 10. Acceptance Testing

### TC-ACC-001: Authorized User Can Retrieve A Consolidated Patient Summary

- Objective: Confirm the application satisfies the core MVP requirement.
- User Story: As an authorized clinician, I want to sign in and retrieve a consolidated patient summary so that I can quickly review the patient record.
- Preconditions:
  - Backend is running.
  - Frontend is accessible.
  - Valid demo credentials are available.
- Acceptance Criteria:
  - User can sign in successfully.
  - User can request a patient summary.
  - Summary includes demographics, encounters, diagnoses, medications, allergies, labs, and imaging.
  - JWT is not visibly exposed in the UI.
- Steps:
  1. Open the app in a browser.
  2. Sign in with valid credentials.
  3. Load the patient summary for `PAT-1001`.
  4. Review the displayed cards.
- Expected Result:
  - The full user journey succeeds without errors.
  - The final screen presents a consolidated patient summary.
- Priority: High

### TC-ACC-002: Unauthorized User Cannot Access Protected Patient Data

- Objective: Confirm the app blocks access to protected clinical data when the user is not authenticated.
- User Story: As a system owner, I want protected patient data to require authentication so that the MVP does not expose clinical records publicly.
- Preconditions: Backend is running.
- Acceptance Criteria:
  - Summary endpoint requires a bearer token.
  - Missing or invalid tokens are rejected.
  - No protected data is returned to unauthorized callers.
- Steps:
  1. Call the summary endpoint without a token.
  2. Call the summary endpoint with an invalid token.
- Expected Result:
  - Both requests are rejected with `401`.
  - No patient summary is returned.
- Priority: High
