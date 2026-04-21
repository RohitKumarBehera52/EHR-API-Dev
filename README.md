# EHR API Dev

`EHR-API-Dev` is a Node.js and Express backend for a lightweight Electronic Health Record MVP. The project focuses on authenticated access to a consolidated patient summary built from JSON-backed patient, encounter, medication, allergy, lab, and imaging data.

The repository currently includes:

- A backend API served from `src/`
- A minimal static frontend in `frontend/`
- Local JSON data stores in `src/data/`
- Node test coverage in `tests/`
- A requirements document in `SRS_EHR_API.md`

## Current MVP Scope

The implemented flow is centered around:

- `POST /api/auth/login` for bearer-token authentication
- `GET /api/health` for service health checks
- `GET /api/patients/:patientId/summary` for a consolidated patient summary

The patient summary combines:

- Demographics
- Latest encounters
- Encounter diagnoses
- Active medications
- Allergies
- Recent lab results
- Imaging references

## Tech Stack

- Node.js
- Express
- JSON file storage
- JWT authentication
- `node:test` + `supertest`

## Project Structure

```text
.
|-- frontend/                Static client assets
|-- scripts/                 Local helper scripts
|-- src/
|   |-- app.js               Express app wiring
|   |-- config/              Environment and auth config
|   |-- controllers/         Route handlers
|   |-- data/                JSON data files
|   |-- docs/                Swagger-related files
|   |-- middleware/          Auth, validation, logging, errors
|   |-- repositories/        Data-access helpers
|   |-- routes/              API route registration
|   |-- services/            Business logic
|   `-- utils/               Shared helpers
|-- tests/                   Integration and e2e tests
|-- server.js                HTTP entry point
`-- SRS_EHR_API.md           Requirements document
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set values as needed.

Example defaults:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=change-me
```

### 3. Start the server

```bash
npm run dev
```

The app listens on `http://localhost:3000` by default.

## Authentication

Protected routes require a bearer token from `POST /api/auth/login`.

Sample seeded users currently referenced by tests include:

- `doctor.demo`
- `nurse.demo`

## Testing

Run the automated test suite with:

```bash
npm test
```

## Notes for Contributors

- The API currently uses local JSON files instead of a database.
- Most business logic for the summary endpoint lives in `src/services/patients.service.js`.
- Route mounting starts in `src/routes/index.js`.
- The repo also includes repo-local Codex guidance under `.codex/` for future AI-assisted maintenance.
