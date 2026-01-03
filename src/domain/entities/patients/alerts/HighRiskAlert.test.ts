import { describe, expect, test } from "bun:test";

import { PatientRisks } from "../PatientRisks";
import { HighRiskAlert } from "./HighRiskAlert";
import { PatientAlerts } from "../PatientAlerts";
import type { PatientEvaluation } from "../PatientEvaluation";

describe('HighRiskAlert', () => {
    const alert = new HighRiskAlert();

    test('should trigger when patient is high risk', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: 'John Doe',
                age: 65,
                gender: 'Male',
                bloodPressure: '150/80',
                temperature: 102,
                visitDate: '2022-01-01',
                diagnosis: '',
                medications: '',
            },
            risks: [
                {
                    type: PatientRisks.TEMPERATURE,
                    score: 2
                },
                {
                    type: PatientRisks.AGE,
                    score: 2
                },
                {
                    type: PatientRisks.BLOOD_PRESSURE,
                    score: 3
                }
            ]
        };

        expect(alert.alert(patientEvaluation)).toEqual({
            name: PatientAlerts.HIGH_RISK,
            triggered: true
        });
    });

    test('should not trigger when patient is not high risk', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: 'John Doe',
                age: 65,
                gender: 'Male',
                bloodPressure: '119/79',
                temperature: 98.6,
                visitDate: '2022-01-01',
                diagnosis: '',
                medications: '',
            },
            risks: [
                {
                    type: PatientRisks.TEMPERATURE,
                    score: 0
                },
                {
                    type: PatientRisks.AGE,
                    score: 2
                },
                {
                    type: PatientRisks.BLOOD_PRESSURE,
                    score: 0
                }
            ]
        };

        expect(alert.alert(patientEvaluation)).toEqual({
            name: PatientAlerts.HIGH_RISK,
            triggered: false
        });
    });
});
