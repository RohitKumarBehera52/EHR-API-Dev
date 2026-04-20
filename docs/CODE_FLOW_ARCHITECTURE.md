# EHR Application Code Flow Architecture

## Overview

This document explains the frontend and backend architecture for the EHR MVP application.

The application is built as a Node.js Express project with:

- A static frontend served from `public/`
- A REST API under `/api`
- Local JSON files used as MVP storage
- A layered backend structure using routes, controllers, services, repositories, validators, middleware, and utilities

## System Flow

```text
User
  |
  v
Browser UI
  |
  v
Frontend JavaScript fetch calls
  |
  v
Express API routes
  |
  v
Controller layer
  |
  v
Service layer
  |
  v
Repository layer
  |
  v
Local JSON data files
```

## Module: Creating and Managing Patient Records, as Well as Recording Clinical Encounters and Diagnoses

This module covers the core MVP workflow for registering patients and documenting clinical visits.

### Module Scope

- Create patient records.
- Search and list patient records.
- Retrieve patient details by ID.
- Update patient demographic details.
- Record clinical encounters for a patient.
- Store visit details, clinical notes, and diagnoses.
- List encounters for a patient in reverse chronological order.

### Frontend Components

```text
public/index.html
  -> Patient create form
  -> Patient search section
  -> Patient record list
  -> Encounter create form
  -> Encounter record list

public/app.js
  -> Handles patient form submission
  -> Handles patient search
  -> Handles patient selection
  -> Handles encounter form submission
  -> Renders patient and encounter cards

public/styles.css
  -> Styles the module layout, forms, cards, buttons, and feedback states
```

### Backend Components

```text
src/routes/patients.routes.js
  -> Patient CRUD routes
  -> Mounts nested encounter routes

src/routes/encounters.routes.js
  -> Encounter create/list routes

src/controllers/patients.controller.js
  -> Patient request and response handling

src/controllers/encounters.controller.js
  -> Encounter request and response handling

src/services/patients.service.js
  -> Patient business logic

src/services/encounters.service.js
  -> Encounter business logic and patient linkage validation

src/repositories/patients.repository.js
  -> Patient JSON storage operations

src/repositories/encounters.repository.js
  -> Encounter JSON storage operations

src/validators/patients.validator.js
  -> Patient create/update validation

src/validators/encounters.validator.js
  -> Encounter create validation
```

### Module Request Flow

```text
Frontend form action
  -> API endpoint
  -> Route
  -> Validator
  -> Controller
  -> Service
  -> Repository
  -> JSON data file
  -> Standard JSON response
  -> Frontend UI update
```

### Module API Endpoints

```text
POST /api/patients
GET /api/patients
GET /api/patients/:patientId
PUT /api/patients/:patientId

POST /api/patients/:patientId/encounters
GET /api/patients/:patientId/encounters
```

## Project Structure

```text
EHR-API-Dev/
  public/
    index.html
    styles.css
    app.js
    assets/

  src/
    app.js
    routes/
    controllers/
    services/
    repositories/
    validators/
    middleware/
    utils/
    data/
    config/
    docs/

  docs/
    CODE_FLOW_ARCHITECTURE.md

  server.js
  package.json
```

## Frontend Architecture

### Frontend Purpose

The frontend provides a simple clinical workspace for the MVP.

It allows a user to:

- Create a patient record.
- Search and list patient records.
- Select a patient ID for encounter entry.
- Save a clinical encounter with diagnosis details.
- View encounters for the selected patient.

### Frontend Files

```text
public/
  index.html
  styles.css
  app.js
  assets/
    care-team.svg
    clinical-workstation.svg
```

### `public/index.html`

Purpose:

- Defines the page structure.
- Provides the static layout for the EHR workspace.
- Contains patient and encounter forms.
- Contains containers where JavaScript renders patient and encounter records.

Main UI sections:

- Sidebar navigation
- Command/status bar
- Metrics cards
- Patient creation panel
- Patient registry panel
- Clinical encounter panel

### `public/styles.css`

Purpose:

- Controls the visual design.
- Defines responsive layout rules.
- Styles the sidebar, cards, forms, buttons, record lists, status chips, and toast messages.

Design approach:

- Dashboard-style clinical console.
- Left navigation rail.
- Record-focused cards.
- Responsive layout for smaller screens.
- Local SVG visual assets to avoid broken external image links.

### `public/app.js`

Purpose:

- Handles browser-side interaction.
- Captures form submissions.
- Calls backend APIs with `fetch`.
- Updates the UI after API responses.
- Shows success and error messages.

Main frontend functions:

```text
formToObject()
  Converts form input into a JavaScript object.

apiRequest()
  Sends HTTP requests to the backend and handles JSON responses.

renderPatients()
  Displays patient records in the registry panel.

renderEncounters()
  Displays encounter records for the selected patient.

loadPatients()
  Fetches patients from GET /api/patients.

loadEncounters()
  Fetches encounters from GET /api/patients/:patientId/encounters.
```

### Frontend User Flow

#### Create Patient

```text
User fills patient form
  -> clicks Create patient
  -> public/app.js captures submit event
  -> POST /api/patients
  -> backend creates patient
  -> frontend refreshes patient list
  -> success toast appears
```

#### Search Patients

```text
User enters search filters
  -> clicks Search
  -> public/app.js builds query string
  -> GET /api/patients?name=&phone=&dateOfBirth=
  -> backend returns matching patients
  -> frontend renders patient cards
```

#### Save Encounter

```text
User selects or enters patient ID
  -> fills encounter form
  -> clicks Save encounter
  -> public/app.js sends POST request
  -> POST /api/patients/:patientId/encounters
  -> backend validates patient and saves encounter
  -> frontend loads encounter list
  -> success toast appears
```

## Backend Architecture

### Backend Purpose

The backend exposes REST APIs for patient and encounter workflows.

It handles:

- Request routing
- Request validation
- Business logic
- JSON file read/write operations
- Standard success responses
- Standard error responses

### Backend Entry Points

#### `server.js`

Purpose:

- Imports the Express app from `src/app.js`.
- Starts the server on the configured port.

Flow:

```text
server.js
  -> require('./src/app')
  -> app.listen(PORT)
```

#### `src/app.js`

Purpose:

- Creates the Express application.
- Serves frontend static files.
- Mounts API routes.
- Registers middleware.

Flow:

```text
src/app.js
  -> express.json()
  -> express.static(public)
  -> app.use('/api', routes)
  -> app.use(notFound)
  -> app.use(errorHandler)
```

## Backend Layers

### 1. Routes Layer

Folder:

```text
src/routes/
```

Purpose:

- Defines API endpoints.
- Connects endpoints to validation middleware and controllers.
- Keeps URL definitions separate from business logic.

Important files:

```text
src/routes/index.js
src/routes/patients.routes.js
src/routes/encounters.routes.js
```

Example flow:

```text
POST /api/patients
  -> validatePatientCreate
  -> patientsController.createPatient
```

Nested encounter route:

```text
/api/patients/:patientId/encounters
```

`encounters.routes.js` uses:

```js
express.Router({ mergeParams: true })
```

This allows the encounter router to access `patientId` from the parent route.

### 2. Validation Layer

Folder:

```text
src/validators/
```

Purpose:

- Validates request data before controller logic runs.
- Returns structured validation errors.

Important files:

```text
src/validators/patients.validator.js
src/validators/encounters.validator.js
```

Validation middleware:

```text
src/middleware/validate.middleware.js
```

Validation flow:

```text
Request
  -> validate(schema)
  -> schema checks request body
  -> valid request continues
  -> invalid request returns 400 error
```

### 3. Controller Layer

Folder:

```text
src/controllers/
```

Purpose:

- Handles HTTP request and response concerns.
- Reads `req.body`, `req.params`, and `req.query`.
- Calls service functions.
- Sends standardized JSON responses.
- Passes errors to the centralized error handler.

Important files:

```text
src/controllers/patients.controller.js
src/controllers/encounters.controller.js
```

Controller rule:

Controllers should not directly access JSON files or contain business rules.

### 4. Service Layer

Folder:

```text
src/services/
```

Purpose:

- Contains business logic.
- Builds patient and encounter objects.
- Applies filtering and sorting.
- Checks patient existence before writing child records.
- Coordinates repository calls.

Important files:

```text
src/services/patients.service.js
src/services/encounters.service.js
```

Service examples:

```text
patientsService.createPatient()
  -> creates patientId
  -> sets createdAt and updatedAt
  -> saves patient through repository

encountersService.createEncounter()
  -> checks patient exists
  -> creates encounterId
  -> normalizes diagnosis array
  -> saves encounter through repository
```

### 5. Repository Layer

Folder:

```text
src/repositories/
```

Purpose:

- Handles data persistence.
- Reads from JSON files.
- Writes to JSON files.
- Provides resource-specific data access methods.

Important files:

```text
src/repositories/json.repository.js
src/repositories/patients.repository.js
src/repositories/encounters.repository.js
```

Shared JSON functions:

```text
readJson(filePath, fallback)
writeJson(filePath, data)
```

Repository flow:

```text
Service
  -> Repository
  -> readJson()
  -> modify data in memory
  -> writeJson()
  -> JSON file updated
```

### 6. Data Layer

Folder:

```text
src/data/
```

Purpose:

- Stores MVP data locally as JSON arrays.

Core files:

```text
patients.json
encounters.json
medications.json
lab-results.json
audit-logs.json
users.json
```

Note:

JSON storage is useful for MVP development, but should be replaced by a database for production use.

### 7. Middleware Layer

Folder:

```text
src/middleware/
```

Purpose:

- Handles cross-cutting request behavior.

Important files:

```text
validate.middleware.js
error-handler.middleware.js
not-found.middleware.js
auth/authenticate.middleware.js
auth/authorize.middleware.js
audit/audit-log.middleware.js
```

Current middleware status:

- Validation middleware is active.
- Error handler is active.
- Not-found handler is active.
- Auth middleware exists as a placeholder.
- Authorization middleware exists as a placeholder.
- Audit middleware exists as a placeholder.

### 8. Utility Layer

Folder:

```text
src/utils/
```

Purpose:

- Provides reusable helper functions and classes.

Important files:

```text
api-response.js
api-error.js
id.util.js
date.util.js
async-handler.js
```

Examples:

```text
id.util.js
  -> creates patient and encounter IDs

date.util.js
  -> creates ISO timestamps

api-response.js
  -> formats success responses

api-error.js
  -> creates structured API errors
```

## API Contract Between Frontend and Backend

### Success Response

```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "dateOfBirth",
      "message": "dateOfBirth must use YYYY-MM-DD format"
    }
  ]
}
```

The frontend expects this response format in `public/app.js`.

## Implemented API Flows

### Health Check

```text
GET /api/health
```

Flow:

```text
Request
  -> src/routes/index.js
  -> returns API health status
```

### Create Patient

```text
POST /api/patients
```

Flow:

```text
Frontend or API client
  -> patients.routes.js
  -> validatePatientCreate
  -> patientsController.createPatient
  -> patientsService.createPatient
  -> patientsRepository.save
  -> data/patients.json
  -> JSON response
```

### List Patients

```text
GET /api/patients
```

Supported filters:

```text
name
phone
dateOfBirth
```

Flow:

```text
Frontend or API client
  -> patients.routes.js
  -> patientsController.listPatients
  -> patientsService.listPatients
  -> patientsRepository.findAll
  -> filter records
  -> JSON response
```

### Get Patient By ID

```text
GET /api/patients/:patientId
```

Flow:

```text
Request
  -> patientsController.getPatientById
  -> patientsService.getPatientById
  -> patientsRepository.findById
  -> JSON response or 404 error
```

### Update Patient

```text
PUT /api/patients/:patientId
```

Flow:

```text
Request
  -> validatePatientUpdate
  -> patientsController.updatePatient
  -> patientsService.updatePatient
  -> patientsRepository.update
  -> data/patients.json
  -> JSON response
```

### Create Encounter

```text
POST /api/patients/:patientId/encounters
```

Flow:

```text
Frontend or API client
  -> patients.routes.js
  -> encounters.routes.js
  -> validateEncounterCreate
  -> encountersController.createEncounter
  -> encountersService.createEncounter
  -> patientsService.getPatientById
  -> encountersRepository.save
  -> data/encounters.json
  -> JSON response
```

### List Patient Encounters

```text
GET /api/patients/:patientId/encounters
```

Flow:

```text
Request
  -> encountersController.listPatientEncounters
  -> encountersService.listPatientEncounters
  -> patientsService.getPatientById
  -> encountersRepository.findByPatientId
  -> sort by visitDate descending
  -> JSON response
```

## Frontend to Backend Mapping

```text
Patient create form
  -> POST /api/patients

Patient search form
  -> GET /api/patients

Patient card Use ID button
  -> copies patientId into encounter form
  -> GET /api/patients/:patientId/encounters

Encounter form
  -> POST /api/patients/:patientId/encounters
```

## Current MVP Features

### Frontend

- Dashboard-style EHR workspace.
- Patient creation form.
- Patient search and list view.
- Patient count metric.
- Encounter creation form.
- Encounter list for selected patient.
- Local SVG assets.
- Toast notifications for success and error states.

### Backend

- Health check endpoint.
- Patient create/list/get/update APIs.
- Encounter create/list APIs.
- Request validation.
- Standard JSON response format.
- Centralized error handling.
- JSON repository read/write layer.

## Known Limitations

- JSON storage is not production-grade.
- Runtime JSON files can change during local testing.
- Authentication is scaffolded but not enforced.
- Role-based authorization is scaffolded but not enforced.
- Audit logging is scaffolded but not fully implemented.
- No automated frontend tests yet.
- No database transaction support.

## Recommended Next Steps

1. Add authentication enforcement for all clinical endpoints.
2. Add role-based authorization for doctor, nurse, lab technician, and admin workflows.
3. Add medication and allergy APIs.
4. Add patient summary endpoint.
5. Add audit logging for create and update operations.
6. Replace JSON storage with a database for production readiness.
7. Add integration tests for patient and encounter flows.
8. Add frontend validation hints before API submission.
