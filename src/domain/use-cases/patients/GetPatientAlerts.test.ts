import { describe, expect, test } from "bun:test";

import type { Patient } from "../../entities/patients/Patient";
import { PatientRisks } from "../../entities/patients/PatientRisks";
import { PatientAlerts } from "../../entities/patients/PatientAlerts";
import type { PatientEvaluation } from "../../entities/patients/PatientEvaluation";

import { GetPatientAlerts } from "./GetPatientAlerts";
import { FeverAlert } from "../../entities/patients/alerts/FeverAlert";
import { HighRiskAlert } from "../../entities/patients/alerts/HighRiskAlert";
import { DataQualityAlert } from "../../entities/patients/alerts/DataQualityAlert";

describe('GetPatientAlerts', () => {
    const getPatientAlerts = new GetPatientAlerts([
        new HighRiskAlert(),
        new FeverAlert(),
        new DataQualityAlert()
    ]);

    const patient: Patient = {
        id: '1',
        name: 'Test Patient',
        age: 30,
        gender: 'M',
        bloodPressure: null,
        temperature: 99.6,
        visitDate: '2023-01-01',
        diagnosis: 'Test_Diagnosis',
        medications: 'Test_Medication',
    };

    const patientEvaluation: PatientEvaluation = {
        patient,
        risks: [
            {
                score: 1,
                type: PatientRisks.TEMPERATURE,
            },
            {
                score: 0,
                type: PatientRisks.BLOOD_PRESSURE,
            },
            {
                score: 0,
                type: PatientRisks.AGE,
            },
        ]
    };


    test('should get patient alerts', () => {
        const result = getPatientAlerts.execute(patientEvaluation);

        expect(result).toEqual([
            {
                "name": PatientAlerts.HIGH_RISK,
                "triggered": false,
            },
            {
                "name": PatientAlerts.FEVER,
                "triggered": true,
            },
            {
                "name": PatientAlerts.DATA_QUALITY_ISSUES,
                "triggered": true,
            }
        ]);
    });
});