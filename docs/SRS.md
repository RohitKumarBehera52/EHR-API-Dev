# Software Requirements Specification (SRS)

## Project Title

Electronic Health Record (EHR) API

## Document Version

Version 1.0

## Date

April 20, 2026

## 1. Purpose

This document defines the requirements for an API-first Electronic Health Record (EHR) system. The system will manage a comprehensive, digital, and near real-time record of a patient's medical journey, including demographic data, medical history, diagnoses, medications, lab results, and imaging references.

The immediate objective is to identify the highest-impact API features that can be implemented in the next 40 minutes as a functional MVP foundation.

## 2. Scope

The EHR API will enable healthcare providers and authorized systems to:

- Create and manage patient records.
- Record clinical encounters and diagnoses.
- Store medication and allergy information.
- Capture lab results and imaging references.
- Retrieve a consolidated patient summary.
- Support secure access for authorized users.

This phase is limited to API development only. No frontend, reporting portal, billing, scheduling UI, or advanced interoperability layer is included in the 40-minute build window.

## 3. Product Overview

An Electronic Health Record (EHR) is a secure, provider-accessible digital health record that supports continuity of care across multiple clinicians and facilities.

The API will serve as the central backend service for:

- Clinical record creation and retrieval.
- Care coordination between providers.
- Reduction of duplicate data entry and medical errors.
- Structured access to patient health data for future applications.

## 4. Intended Users

- Doctors
- Nurses
- Lab technicians
- Radiology staff
- Hospital administrators
- Authorized external systems

## 5. Assumptions

- The first delivery is internal or pilot usage.
- Authentication can be basic but must be designed to support future RBAC.
- Real-time in this phase means data becomes immediately available after API write success.
- Imaging files themselves will not be uploaded in the first 40-minute build; only metadata or URLs will be stored.
- Audit logging will be minimal in MVP, but hooks should exist for later enhancement.

## 6. Business Goals

- Improve care quality by giving providers fast access to patient history.
- Reduce clinical errors caused by missing or inconsistent information.
- Enable secure information sharing among multiple providers.
- Establish a clean API foundation for future EHR modules.

## 7. Functional Requirements

### 7.1 Patient Management

The system shall:

- Create a patient record.
- Update patient demographic information.
- Retrieve a patient by ID.
- List patients with basic filters such as name, mobile number, or date of birth.

#### Patient Core Fields

- `patientId`
- `firstName`
- `lastName`
- `dateOfBirth`
- `gender`
- `phone`
- `email`
- `address`
- `bloodGroup`
- `emergencyContact`
- `createdAt`
- `updatedAt`

### 7.2 Encounter and Diagnosis Management

The system shall:

- Create a clinical encounter for a patient.
- Record visit date, provider, chief complaint, notes, and diagnoses.
- Retrieve all encounters for a patient in reverse chronological order.

#### Encounter Core Fields

- `encounterId`
- `patientId`
- `providerId`
- `visitDate`
- `visitType`
- `chiefComplaint`
- `clinicalNotes`
- `diagnoses[]`
- `vitals`
- `createdAt`

### 7.3 Medication and Allergy Management

The system shall:

- Add active medications for a patient.
- Add allergy records for a patient.
- Retrieve current medications and allergies for a patient.

#### Medication Core Fields

- `medicationId`
- `patientId`
- `drugName`
- `dosage`
- `frequency`
- `route`
- `startDate`
- `endDate`
- `status`

#### Allergy Core Fields

- `allergyId`
- `patientId`
- `allergen`
- `reaction`
- `severity`
- `status`

### 7.4 Lab Result Management

The system shall:

- Record a lab test result for a patient.
- Retrieve lab results for a patient.
- Support basic fields for test name, value, unit, status, and result date.

#### Lab Result Core Fields

- `labResultId`
- `patientId`
- `encounterId`
- `testName`
- `resultValue`
- `unit`
- `referenceRange`
- `status`
- `resultDate`

### 7.5 Imaging Record Management

The system shall:

- Record imaging study metadata.
- Store modality, study date, summary, and file/reference URL.
- Retrieve imaging references for a patient.

#### Imaging Core Fields

- `imagingId`
- `patientId`
- `encounterId`
- `modality`
- `studyName`
- `studyDate`
- `impression`
- `imageUrl`

### 7.6 Patient Summary

The system shall:

- Provide a single endpoint that returns a consolidated patient summary.
- Include demographics, latest encounters, diagnoses, active medications, allergies, recent lab results, and imaging references.

This is a high-impact feature because it reduces multiple client-side API calls and gives providers a quick clinical overview.

### 7.7 Authentication and Access Control

The system shall:

- Require authenticated access for all clinical endpoints.
- Support login for users or system clients.
- Attach the authenticated user identity to write operations.

For the MVP, access control may be role-light, but the design should support future roles such as:

- `doctor`
- `nurse`
- `lab_tech`
- `admin`

## 8. Non-Functional Requirements

### 8.1 Security

- All endpoints must require authentication except health check.
- Sensitive patient data must not be exposed in logs.
- Input validation must be enforced.
- API must be ready for HTTPS deployment.

### 8.2 Performance

- Read operations for single patient summary should respond within 1 to 2 seconds under MVP load.
- Write operations should complete within 1 second under light internal usage.

### 8.3 Reliability

- API should return meaningful status codes and structured error responses.
- Invalid requests must not corrupt patient data.

### 8.4 Maintainability

- Use modular resource-based routing.
- Separate controllers, services, models, and validation where possible.
- Use consistent JSON response structure.

### 8.5 Scalability

- Data model should support future additions such as prescriptions, appointments, referrals, billing, and FHIR mapping.

## 9. API Design Requirements

### 9.1 Recommended Initial Endpoints

#### Health

- `GET /api/health`

#### Auth

- `POST /api/auth/login`

#### Patients

- `POST /api/patients`
- `GET /api/patients`
- `GET /api/patients/{patientId}`
- `PUT /api/patients/{patientId}`
- `GET /api/patients/{patientId}/summary`

#### Encounters

- `POST /api/patients/{patientId}/encounters`
- `GET /api/patients/{patientId}/encounters`

#### Medications

- `POST /api/patients/{patientId}/medications`
- `GET /api/patients/{patientId}/medications`

#### Allergies

- `POST /api/patients/{patientId}/allergies`
- `GET /api/patients/{patientId}/allergies`

#### Lab Results

- `POST /api/patients/{patientId}/lab-results`
- `GET /api/patients/{patientId}/lab-results`

#### Imaging

- `POST /api/patients/{patientId}/imaging`
- `GET /api/patients/{patientId}/imaging`

### 9.2 Response Format

All responses should use JSON.

#### Success Example

```json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "patientId": "PAT-1001"
  }
}
```

#### Error Example

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "dateOfBirth",
      "message": "Invalid date format"
    }
  ]
}
```

## 10. Data Model Overview

### Core Entities

- Patient
- User
- Encounter
- Diagnosis
- Medication
- Allergy
- LabResult
- ImagingRecord

### Relationship Summary

- One patient can have many encounters.
- One patient can have many medications.
- One patient can have many allergies.
- One patient can have many lab results.
- One patient can have many imaging records.
- One encounter can have many diagnoses.

## 11. High-Impact Features for the Next 40 Minutes

The following features provide the best balance of business value, clinical usefulness, and implementation speed for an API-only delivery.

### Priority 1: Patient CRUD

Impact:

- Foundational for all other EHR records.
- Enables immediate patient registration and lookup.

Why build now:

- Simple schema and straightforward endpoints.
- Unblocks every other clinical module.

Deliverables:

- `POST /api/patients`
- `GET /api/patients`
- `GET /api/patients/{patientId}`
- `PUT /api/patients/{patientId}`

### Priority 2: Encounter Creation and Listing

Impact:

- Captures the actual clinical interaction.
- Makes the EHR useful beyond demographic storage.

Why build now:

- High clinical value with limited complexity.
- Can store diagnoses inline or in a nested array for MVP.

Deliverables:

- `POST /api/patients/{patientId}/encounters`
- `GET /api/patients/{patientId}/encounters`

### Priority 3: Medication and Allergy APIs

Impact:

- Medication and allergy visibility directly helps reduce treatment errors.
- High patient-safety value for relatively low implementation effort.

Why build now:

- Simple linked resources.
- Clinically meaningful without requiring advanced workflows.

Deliverables:

- `POST /api/patients/{patientId}/medications`
- `GET /api/patients/{patientId}/medications`
- `POST /api/patients/{patientId}/allergies`
- `GET /api/patients/{patientId}/allergies`

### Priority 4: Patient Summary Endpoint

Impact:

- Highest provider-facing convenience.
- Aggregates key information in one response.

Why build now:

- Can be implemented on top of the first few resources.
- Makes the MVP feel substantially more complete.

Deliverables:

- `GET /api/patients/{patientId}/summary`

### Priority 5: Basic Authentication

Impact:

- Required baseline security for protected health information.
- Prevents building an unsafe API even in MVP form.

Why build now:

- A minimal token or JWT guard is feasible in a short timeframe.
- Supports traceability for future audit logging.

Deliverables:

- `POST /api/auth/login`
- Auth middleware or guard for protected routes

## 12. Features to Defer After the 40-Minute Window

These are important, but lower priority for immediate MVP delivery:

- Lab result module
- Imaging metadata module
- Audit trail and access history
- Role-based authorization enforcement
- File upload for reports or scans
- Notifications and alerts
- HL7/FHIR interoperability
- Appointment scheduling
- Billing and claims
- Clinical decision support
- Versioned medical record history

## 13. Suggested 40-Minute Delivery Plan

### 0 to 10 Minutes

- Set up project structure.
- Add health check.
- Create patient model and patient endpoints.

### 10 to 20 Minutes

- Add encounter endpoints.
- Validate patient-to-encounter linkage.

### 20 to 30 Minutes

- Add medications and allergies endpoints.
- Add basic validation and error responses.

### 30 to 40 Minutes

- Add patient summary endpoint.
- Add simple authentication middleware.
- Smoke test the core endpoints.

## 14. MVP Acceptance Criteria

The MVP is considered acceptable if:

- An authenticated client can create and retrieve a patient.
- An authenticated client can create and list encounters for a patient.
- An authenticated client can create and list medications and allergies.
- An authenticated client can retrieve a consolidated patient summary.
- The API returns proper HTTP status codes and structured JSON responses.
- Invalid requests are rejected with validation messages.

## 15. Risks and Constraints

- Healthcare data is sensitive, so weak authentication is a temporary MVP compromise only.
- Without audit logs, compliance readiness is incomplete.
- Without role-based permissions, access control remains coarse.
- If a database schema is overdesigned too early, the 40-minute build goal may be missed.

## 16. Recommended MVP Architecture

- REST API
- JSON payloads
- Relational database or document database
- Authentication using JWT or static token for pilot
- Layered architecture:
  - Routes
  - Controllers
  - Services
  - Models
  - Middleware

## 17. Final Recommendation

For the next 40 minutes, the most valuable EHR API scope is:

1. Patient CRUD
2. Encounter create/list
3. Medication create/list
4. Allergy create/list
5. Patient summary endpoint
6. Basic authentication middleware

This scope is small enough to build quickly, yet meaningful enough to demonstrate a real EHR workflow with patient registration, visit tracking, medication safety data, and consolidated clinical retrieval.

Lab results and imaging should be the next iteration once the core patient and clinical workflow endpoints are stable.
