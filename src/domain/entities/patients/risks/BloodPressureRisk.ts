import type { Patient } from "../Patient";
import { PatientRisks } from "../PatientRisks";

import type { Risk } from "../../../../shared/risks/Risk";
import type { RiskStrategy } from "../../../../shared/risks/RiskStrategy";

export class BloodPressureRisk implements RiskStrategy<Patient, PatientRisks> {
    public constructor() { }

    public risk(patient: Patient): Risk<PatientRisks> {
        return {
            type: PatientRisks.BLOOD_PRESSURE,
            score: !patient.bloodPressure ? 0 : this.calculateBloodPressureRiskScore(patient.bloodPressure)
        };
    }

    private calculateBloodPressureRiskScore(bloodPressure: string): number {
        const [systolic, diastolic] = bloodPressure.split('/').map(Number) as [number, number];

        if (systolic >= 140 || diastolic >= 90) {
            return 3;
        }

        if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
            return 2;
        }

        if (systolic >= 120 && systolic <= 129 && diastolic < 80) {
            return 1;
        }

        return 0;
    }
}