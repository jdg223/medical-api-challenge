import { expect, test, describe } from "bun:test";

import { PatientAlerts } from "../PatientAlerts";
import { DataQualityAlert } from "./DataQualityAlert";

import type { PatientEvaluation } from "../PatientEvaluation";

describe('DataQualityAlert', () => {
    const alert = new DataQualityAlert(['diagnosis', 'medications']);

    test('should trigger when patient has bad data', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: null,
                age: 30,
                gender: 'M',
                bloodPressure: null,
                temperature: 99.6,
                visitDate: '2022-01-01',
                diagnosis: 'Test_Diagnosis',
                medications: 'Test_Medication',
            },
            risks: []
        };

        expect(alert.alert(patientEvaluation)).toEqual({
            name: PatientAlerts.DATA_QUALITY_ISSUES,
            triggered: true
        });
    });

    test('should not trigger when patient has quality data', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: 'John Doe',
                age: 30,
                gender: 'M',
                bloodPressure: '120/80',
                temperature: 99.6,
                visitDate: '2022-01-01',
                diagnosis: 'Test_Diagnosis',
                medications: 'Test_Medication',
            },
            risks: []
        };

        expect(alert.alert(patientEvaluation)).toEqual({
            name: PatientAlerts.DATA_QUALITY_ISSUES,
            triggered: false
        });
    });

    test('should not trigger when excluded properties are null', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: 'John Doe',
                age: 30,
                gender: 'M',
                bloodPressure: '120/80',
                temperature: 99.6,
                visitDate: '2022-01-01',
                diagnosis: null,
                medications: null,
            },
            risks: []
        };

        expect(alert.alert(patientEvaluation)).toEqual({
            name: PatientAlerts.DATA_QUALITY_ISSUES,
            triggered: false
        });
    });
});