import type { Patient } from "../Patient";
import { PatientRisks } from "../PatientRisks";

import type { Risk } from "../../../../shared/risks/Risk";
import type { RiskStrategy } from "../../../../shared/risks/RiskStrategy";

export class TemperatureRisk implements RiskStrategy<Patient, PatientRisks> {
    public constructor() { }

    public risk(patient: Patient): Risk<PatientRisks> {
        return {
            type: PatientRisks.TEMPERATURE,
            score: !patient.temperature ? 0 : this.calculateTemperatureRiskScore(patient.temperature)
        };
    }

    private calculateTemperatureRiskScore(temperature: number): number {
        if (temperature <= 99.5) {
            return 0;
        }

        if (temperature >= 99.6 && temperature <= 100.9) {
            return 1;
        }

        return 2;
    }
}