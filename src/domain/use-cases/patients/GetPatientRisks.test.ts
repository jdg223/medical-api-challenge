import { describe, expect, test } from "bun:test";

import type { Patient } from "../../entities/patients/Patient";

import { AgeRisk } from "../../entities/patients/risks/AgeRisk";
import { PatientRisks } from "../../entities/patients/PatientRisks";
import { TemperatureRisk } from "../../entities/patients/risks/TemperatureRisk";
import { BloodPressureRisk } from "../../entities/patients/risks/BloodPressureRisk";

import { GetPatientRisks } from "./GetPatientRisks";

describe('GetPatientRisks', () => {
    const getPatientRisks = new GetPatientRisks([
        new TemperatureRisk(),
        new BloodPressureRisk(),
        new AgeRisk()
    ]);

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

    test('should get patient risks', () => {
        const result = getPatientRisks.execute(patient);

        expect(result).toEqual([
            {
                type: PatientRisks.TEMPERATURE,
                score: 1,
            },
            {
                type: PatientRisks.BLOOD_PRESSURE,
                score: 2,
            },
            {
                type: PatientRisks.AGE,
                score: 0,
            },
        ]);
    });
}); 