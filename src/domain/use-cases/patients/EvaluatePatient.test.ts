import { describe, expect, test } from "bun:test";

import { EvaluatePatient } from "./EvaluatePatient";
import type { Patient } from "../../entities/patients/Patient";
import { PatientRisks } from "../../entities/patients/PatientRisks";
import type { PatientEvaluation } from "../../entities/patients/PatientEvaluation";

import { GetPatientRisks } from "./GetPatientRisks";
import { AgeRisk } from "../../entities/patients/risks/AgeRisk";
import { TemperatureRisk } from "../../entities/patients/risks/TemperatureRisk";
import { BloodPressureRisk } from "../../entities/patients/risks/BloodPressureRisk";

describe('EvaluatePatient', () => {
    const evaluatePatient = new EvaluatePatient(
        new GetPatientRisks([new TemperatureRisk(), new BloodPressureRisk(), new AgeRisk()])
    );

    const patient: Patient = {
        id: '1',
        name: 'Test Patient',
        age: 30,
        gender: 'M',
        bloodPressure: '120/80',
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
                score: 2,
                type: PatientRisks.BLOOD_PRESSURE,
            },
            {
                score: 0,
                type: PatientRisks.AGE,
            },
        ]
    };

    test(`should evaluate patient`, () => {
        const result = evaluatePatient.execute(patient);
        expect(result).toEqual(patientEvaluation);
    });
});