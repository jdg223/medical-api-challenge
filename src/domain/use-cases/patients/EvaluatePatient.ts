import type { UseCase } from "../UseCase";

import type { Patient } from "../../entities/patients/Patient";
import type { PatientEvaluation } from "../../entities/patients/PatientEvaluation";

import type { GetPatientRisks } from "./GetPatientRisks";

export class EvaluatePatient implements UseCase<Patient, PatientEvaluation> {
    public constructor(private readonly getPatientRisks: GetPatientRisks) { }

    public execute(patient: Patient): PatientEvaluation {
        const risks = this.getPatientRisks.execute(patient);

        return { patient, risks };
    }
}