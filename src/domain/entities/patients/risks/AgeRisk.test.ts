import { expect, test, describe } from "bun:test";

import { AgeRisk } from "./AgeRisk";
import type { Patient } from "../Patient";
import { PatientRisks } from "../PatientRisks";

describe('AgeRisk', () => {
    const ageRisk = new AgeRisk();

    test('score should be 0 when age is missing', () => {
        const patient: Patient = {
            id: '1',
            name: 'John Doe',
            age: null,
            gender: 'M',
            bloodPressure: '120/80',
            temperature: 99.6,
            visitDate: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(ageRisk.risk(patient)).toEqual({
            type: PatientRisks.AGE,
            score: 0
        });
    });

    test('score should be 0 when age is less than 40', () => {
        const patient: Patient = {
            id: '1',
            name: 'John Doe',
            age: 30,
            gender: 'M',
            bloodPressure: '120/80',
            temperature: 99.6,
            visitDate: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(ageRisk.risk(patient)).toEqual({
            type: PatientRisks.AGE,
            score: 0
        });
    });

    test('score should be 1 when age is between 40 and 65', () => {
        const patient: Patient = {
            id: '1',
            name: 'John Doe',
            age: 50,
            gender: 'M',
            bloodPressure: '120/80',
            temperature: 99.6,
            visitDate: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(ageRisk.risk(patient)).toEqual({
            type: PatientRisks.AGE,
            score: 1
        });
    });

    test("score should be 2 when age is greater than 65", () => {
        const patient: Patient = {
            id: '1',
            name: 'John Doe',
            age: 70,
            gender: 'M',
            bloodPressure: '120/80',
            temperature: 99.6,
            visitDate: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(ageRisk.risk(patient)).toEqual({
            type: PatientRisks.AGE,
            score: 2
        });
    });
});