import { expect, test, describe } from "bun:test";

import type { Patient } from "../Patient";
import { PatientRisks } from "../PatientRisks";
import { BloodPressureRisk } from "./BloodPressureRisk";

describe('BloodPressureRisk', () => {
    const riskStrategy = new BloodPressureRisk();

    const basePatient: Patient = {
        id: '1',
        name: 'Test Patient',
        age: 30,
        gender: 'M',
        bloodPressure: null,
        temperature: 98.6,
        visitDate: '2023-01-01',
        diagnosis: '',
        medications: '',
    };

    test('score should be 0 when blood pressure is null', () => {
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: null })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 0
        });
    });

    test('score should be 0 when blood pressure is Normal (Sys < 120 AND Dia < 80)', () => {
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '119/79' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 0
        });
    });

    test('score should be 1 when blood pressure is Elevated (Sys 120-129 AND Dia < 80)', () => {
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '120/79' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 1
        });

        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '129/70' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 1
        });
    });

    test('score should be 2 when blood pressure is Stage 1 (Sys 130-139 OR Dia 80-89)', () => {
        // Systolic in range
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '130/79' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 2
        });

        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '139/79' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 2
        });

        // Diastolic in range
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '120/80' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 2
        });

        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '129/89' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 2
        });
    });

    test('score should be 3 when blood pressure is Stage 2 (Sys >= 140 OR Dia >= 90)', () => {
        // Systolic high
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '140/80' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 3
        });

        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '160/70' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 3
        });

        // Diastolic high
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '120/90' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 3
        });

        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '130/100' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 3
        });
    });

    test('score should use the higher risk stage when categories differ', () => {
        // Stage 2 (Sys 140+) vs Normal (Dia < 80) -> Expect Stage 2 (3)
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '145/70' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 3
        });

        // Stage 1 (Sys 135) vs Elevated (Dia < 80) -> Expect Stage 1 (2)
        // Wait, Elevated requires Dia < 80. If Sys is 135, it's Stage 1. 2 > 1. Correct.
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '135/75' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 2
        });

        // Elevated (Sys 125) vs Stage 1 (Dia 85) -> Expect Stage 1 (2)
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '125/85' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 2
        });

        // Normal (Sys 115) vs Stage 2 (Dia 95) -> Expect Stage 2 (3)
        expect(riskStrategy.risk({ ...basePatient, bloodPressure: '115/95' })).toEqual({
            type: PatientRisks.BLOOD_PRESSURE,
            score: 3
        });
    });
});
