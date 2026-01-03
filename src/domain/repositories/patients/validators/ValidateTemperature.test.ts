import { expect, test, describe } from "bun:test";

import type { PatientDTO } from "../PatientDTO";
import { ValidateTemperature } from "./ValidateTemperature";

describe('ValidateTemperature', () => {
    const validator = new ValidateTemperature();

    test('should return true for valid temperature', () => {
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

    test('should return false is temperature is null', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/80',
            temperature: null,
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };
        expect(validator.isValid(patient)).toBe(false);
    });

    test('should return false is temperature is missing', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/80',
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };
        expect(validator.isValid(patient)).toBe(false);
    });

    test('should return false if temperature is non-numeric', () => {
        const patient: PatientDTO = {
            patient_id: '1',
            age: 25,
            name: 'John Doe',
            gender: 'M',
            blood_pressure: '120/80',
            temperature: '98.6',
            visit_date: '2022-01-01',
            diagnosis: '',
            medications: '',
        };
        expect(validator.isValid(patient)).toBe(false);
    });
});