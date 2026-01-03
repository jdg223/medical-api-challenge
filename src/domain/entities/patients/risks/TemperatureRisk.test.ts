import { expect, test, describe } from "bun:test";
import type { Patient } from "../Patient";
import { PatientRisks } from "../PatientRisks";
import { TemperatureRisk } from "./TemperatureRisk";

describe('TemperatureRisk', () => {
    const riskStrategy = new TemperatureRisk();

    test('score should be 0 when temperature is null', () => {
        const patient: Patient = {
            id: '1',
            name: 'Test Patient',
            age: 30,
            gender: 'M',
            bloodPressure: null,
            temperature: null,
            visitDate: '2023-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(riskStrategy.risk(patient)).toEqual({
            type: PatientRisks.TEMPERATURE,
            score: 0
        });
    });

    test('score should be 0 when patient temperature is normal', () => {
        const patient: Patient = {
            id: '1',
            name: 'Test Patient',
            age: 30,
            gender: 'M',
            bloodPressure: null,
            temperature: 99.5,
            visitDate: '2023-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(riskStrategy.risk(patient)).toEqual({
            type: PatientRisks.TEMPERATURE,
            score: 0
        });
    });

    test('score should be 1 when patient has low fever', () => {
        const patient: Patient = {
            id: '1',
            name: 'Test Patient',
            age: 30,
            gender: 'M',
            bloodPressure: null,
            temperature: 99.6,
            visitDate: '2023-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(riskStrategy.risk(patient)).toEqual({
            type: PatientRisks.TEMPERATURE,
            score: 1
        });
    });

    test('score should be 2 when patient has high fever', () => {
        const patient: Patient = {
            id: '1',
            name: 'Test Patient',
            age: 30,
            gender: 'M',
            bloodPressure: null,
            temperature: 101,
            visitDate: '2023-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(riskStrategy.risk(patient)).toEqual({
            type: PatientRisks.TEMPERATURE,
            score: 2
        });
    });
});