# medical-api-challenge

I made this for a coding challenge I had to do. If you think I should have implemented something in a different way leave a comment!!!!

## Challenge Context
**Goal**: The objective was to build a system that interacts with a "DemoMed Healthcare API" to fetch patient data, calculate risk scores based on vital signs, and satisfy specific alert criteria.

**Key Requirements**:
1.  **High-Risk Patients**: Identify all patients with a total risk score >= 4.
2.  **Fever Patients**: Identify all patients with a temperature >= 99.6°F.
3.  **Data Quality Issues**: Identify patients with missing or malformed data (e.g., "N/A" blood pressure, invalid ages).

**API Behavior & Challenges**:
-   **Rate Limiting**: The API frequently returns 429 Too Many Requests errors.
-   **Intermittent Failures**: Approximately 5% of requests fail with 429/500/503 errors.
-   **Inconsistent Data**: Fields like `blood_pressure` or `temperature` often contain non-numeric strings ("120/80", "150/", "INVALID", "N/A"), or data is completely missing.
-   **Pagination**: Resources must be fetched in pages (default 20 items/page).

## Risk Scoring Logic
The system calculates a total risk score for each patient by summing scores from three categories. **Missing or invalid data always results in 0 points for that category.**

### 1. [Age Risk](src/domain/entities/patients/risks/AgeRisk.ts)
-   **Under 40**: 0 points
-   **40 - 65**: 1 point
-   **Over 65**: 2 points

### 2. [Temperature Risk](src/domain/entities/patients/risks/TemperatureRisk.ts)
-   **Normal (<= 99.5°F)**: 0 points
-   **Low Fever (99.6°F - 100.9°F)**: 1 point
-   **High Fever (>= 101.0°F)**: 2 points

### 3. [Blood Pressure Risk](src/domain/entities/patients/risks/BloodPressureRisk.ts)
Based on Systolic/Diastolic readings. If categories vary, the **higher** risk stage is used.
-   **Normal**: 0 points
-   **Elevated**: 1 point
-   **Stage 1 Hypertension**: 2 points
-   **Stage 2 Hypertension**: 3 points

## Solution Approach
This solution emphasizes reliability, correctness, and maintainability using **Clean Architecture**.

### Key Features
-   **Clean Architecture / DDD**: The code is organized into **Entities** (core logic), **Use Cases** (business rules), and **Repositories** (data access), keeping the domain logic isolated from the API implementation.
-   **100% Test Coverage**: Every component, from the HTTP client to the risk calculators, is fully unit tested.
-   **No External Dependencies**: Built using only standard library features and the Bun runtime (except for Bun's built-in test runner).
-   **Robust Error Handling**:
    -   **Retry Strategy**: Automatically retries 500/503 errors with exponential backoff.
    -   **Rate Limiting**: Respects headers/errors and manages request pacing.

### Data Consistency & Logical Flow
To handle the "messy" real-world data from the API, the system follows a strict pipeline:
1.  **Ingestion & Normalization**: The [`GetPatients`](src/domain/use-cases/patients/GetPatients.ts) use case utilizes the [`HttpPatientRepository`](src/domain/repositories/patients/HttpPatientRepository.ts) to fetch raw JSON and converts it into strict TypeScript **Entities**. During this phase, "dirty" data (like "150/" for BP) is safely parsed or converted to null, ensuring the core domain logic only operates on predictable data structures.
2.  **Risk Evaluation**: The [`EvaluatePatient`](src/domain/use-cases/patients/EvaluatePatient.ts) use case orchestrates the risk scoring by utilizing `GetPatientRisks` to apply the scoring rules to the normalized entities.
3.  **Alert Generation**: The [`GetPatientAlerts`](src/domain/use-cases/patients/GetPatientAlerts.ts) use case aggregates the risk scores and checks against the alert thresholds (Risk >= 4, Fever >= 99.6, etc.).
4.  **Submission**: Finally, the results are formatted and posted to `/submit-assessment` via [`SubmitAssessment`](src/domain/use-cases/assessments/SubmitAssessment.ts) using the [`HttpAssessmentRepository`](src/domain/repositories/assessments/HttpAssessmentRepository.ts).

## To run:

You will need to have bun installed on your system. You can install it from [here](https://bun.com/).

### Create .env file from .env.example and fill in the values

```bash
 cp .env.example .env
```

### Run
```bash
bun run index.ts
```

### To test
```bash
bun test --coverage
```
