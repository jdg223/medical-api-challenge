import { expect, test, describe } from "bun:test";

import { ValidateAge } from "./ValidateAge";
import type { PatientDTO } from "../PatientDTO";

describe('ValidateAge', () => {
    const validator = new ValidateAge();

    test('should return true for valid age', () => {
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

    test('should return false is age is null', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: null,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/80',
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };
        expect(validator.isValid(patient)).toBe(false);
    });

    test('should return true if age is numeric string', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: '25',
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

    test('should return false if age is missing', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/80',
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(validator.isValid(patient)).toBe(false);
    });

    test('should return false if age is non-numeric string', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 'thirty-five',
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/80',
            temperature: 99.6,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };

        expect(validator.isValid(patient)).toBe(false);
    });
});