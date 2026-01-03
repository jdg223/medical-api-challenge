import type { UseCase } from "../UseCase";

import type { Patient } from "../../entities/patients/Patient";
import { PatientRisks } from "../../entities/patients/PatientRisks";

import type { Risk } from "../../../shared/risks/Risk";
import type { RiskStrategy } from "../../../shared/risks/RiskStrategy";

export class GetPatientRisks implements UseCase<Patient, Risk<PatientRisks>[]> {
    public constructor(private readonly strategies: RiskStrategy<Patient, PatientRisks>[]) { }

    public execute(patient: Patient): Risk<PatientRisks>[] {
        const risks: Risk<PatientRisks>[] = [];

        for (const strategy of this.strategies) {
            const risk = strategy.risk(patient);

            risks.push(risk);
        }

        return risks;
    }
}