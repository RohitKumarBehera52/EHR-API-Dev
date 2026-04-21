# EHR API Data Flow

This diagram describes how data travels through the current MVP implementation.

## 1. Authentication Flow

1. The browser frontend sends `POST /api/auth/login` with username and password.
2. `auth.routes.js` forwards the request to `auth.controller.js`.
3. `auth.service.js` loads the user from `users.repository.js`.
4. The repository reads `src/data/users.json` through `json.repository.js`.
5. `password.util.js` verifies the password hash.
6. `token.util.js` signs a JWT access token.
7. The API returns the token and user payload to the frontend.
8. The frontend keeps the JWT in memory and does not render it on screen.

## 2. Protected Patient Summary Flow

1. The browser frontend sends `GET /api/patients/:patientId/summary`.
2. The request includes `Authorization: Bearer <jwt>`.
3. `authenticate.middleware.js` validates the token using `token.util.js`.
4. The route calls `patients.controller.js`.
5. The controller calls `patients.service.js`.
6. The service aggregates data from:
   - `patients.repository.js` -> `src/data/patients.json`
   - `encounters.repository.js` -> `src/data/encounters.json`
   - `medications.repository.js` -> `src/data/medications.json`
   - direct JSON reads for `allergies.json`, `lab-results.json`, and `imaging.json`
7. The service shapes a consolidated response with:
   - demographics
   - latest encounters
   - diagnoses
   - active medications
   - allergies
   - recent lab results
   - imaging references
8. The API returns the summary JSON to the frontend for rendering.

## Generated Asset

Open the visual diagram here:

- [architecture-data-flow.svg](/c:/Users/2000115835/Documents/Codex/EHR-API-Dev/docs/architecture-data-flow.svg)
