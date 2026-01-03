import { expect, test, describe } from "bun:test";

import { FeverAlert } from "./FeverAlert";
import { PatientRisks } from "../PatientRisks";
import { PatientAlerts } from "../PatientAlerts";
import type { PatientEvaluation } from "../PatientEvaluation";

describe('FeverAlert', () => {
    const alert = new FeverAlert();

    test('should trigger when patient has a fever', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: 'John Doe',
                age: 30,
                gender: 'M',
                bloodPressure: '120/80',
                temperature: 99.6,
                visitDate: '2022-01-01',
                diagnosis: '',
                medications: '',
            },
            risks: [{
                type: PatientRisks.TEMPERATURE,
                score: 1
            }]
        };

        expect(alert.alert(patientEvaluation)).toEqual({
            name: PatientAlerts.FEVER,
            triggered: true
        });
    });

    test('should not trigger when patient does not have a fever', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: 'John Doe',
                age: 30,
                gender: 'M',
                bloodPressure: '120/80',
                temperature: 98.6,
                visitDate: '2022-01-01',
                diagnosis: '',
                medications: '',
            },
            risks: [{
                type: PatientRisks.TEMPERATURE,
                score: 0
            }]
        };

        expect(alert.alert(patientEvaluation)).toEqual({
            name: PatientAlerts.FEVER,
            triggered: false
        });
    });

    test('should throw error when patient temperature hasn\'t been evaluated', () => {
        const patientEvaluation: PatientEvaluation = {
            patient: {
                id: '1',
                name: 'John Doe',
                age: 30,
                gender: 'M',
                bloodPressure: '120/80',
                temperature: 99.6,
                visitDate: '2022-01-01',
                diagnosis: '',
                medications: '',
            },
            risks: []
        };
        expect(() => alert.alert(patientEvaluation)).toThrow('Patient temperature was not evaluated.');
    });
});