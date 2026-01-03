import type { Patient } from "./Patient";
import type { PatientRisks } from "./PatientRisks";

import type { Risk } from "../../../shared/risks/Risk";

export interface PatientEvaluation {
    patient: Patient;
    risks: Risk<PatientRisks>[];
}