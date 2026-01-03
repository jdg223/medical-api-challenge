import type { Patient } from "../Patient";

import { PatientRisks } from "../PatientRisks";
import type { Risk } from "../../../../shared/risks/Risk";
import type { RiskStrategy } from "../../../../shared/risks/RiskStrategy";

export class AgeRisk implements RiskStrategy<Patient, PatientRisks> {
    public constructor() { }

    public risk(patient: Patient): Risk<PatientRisks> {
        return {
            type: PatientRisks.AGE,
            score: !patient.age ? 0 : this.calculateAgeRiskScore(patient.age)
        };
    }

    private calculateAgeRiskScore(age: number): number {
        if (age < 40) {
            return 0;
        }

        if (age >= 40 && age <= 65) {
            return 1;
        }

        return 2;
    }
}