import { expect, test, describe } from "bun:test";

import type { PatientDTO } from "../PatientDTO";
import { ValidateBloodPressure } from "./ValidateBloodPressure";

describe('ValidateBloodPressure', () => {
    const validator = new ValidateBloodPressure();

    test('should return true for valid blood pressure', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/80',
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };
        expect(validator.isValid(patient)).toBe(true);
    });

    test('should return false is blood pressure is null', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: null,
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };
        expect(validator.isValid(patient)).toBe(false);
    });

    test('should return false is blood pressure is missing', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };
        expect(validator.isValid(patient)).toBe(false);
    });

    test('should return false if blood pressure is non-numeric string', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '180/thirty-five',
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(validator.isValid(patient)).toBe(false);
    });

    test('should return false if blood pressure is missing diastolic value', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/',
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(validator.isValid(patient)).toBe(false);
    });
});