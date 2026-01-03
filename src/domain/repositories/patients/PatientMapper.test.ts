import { describe, expect, test } from "bun:test";

import type { Patient } from "../../entities/patients/Patient";

import type { PatientDTO } from "./PatientDTO";
import { PatientMapper } from "./PatientMapper";

import { ValidateAge } from "./validators/ValidateAge";
import { ValidateTemperature } from "./validators/ValidateTemperature";
import { ValidateBloodPressure } from "./validators/ValidateBloodPressure";

describe('PatientMapper', () => {
    const patientMapper = new PatientMapper(
        new ValidateAge(),
        new ValidateBloodPressure(),
        new ValidateTemperature()
    );

    const patientDTO: PatientDTO = {
        patient_id: '1',
        name: 'Test Patient',
        age: 30,
        gender: 'M',
        blood_pressure: '120/80',
        temperature: 99.6,
        visit_date: '2023-01-01',
        diagnosis: 'Test_Diagnosis',
        medications: 'Test_Medication',
    };

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

    test('temperature should be null when value from dto is missing from dto', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, temperature: undefined });

        expect(patient).toEqual({ ...patient, temperature: null });
    });

    test('temperature should be null when value from dto is non-numeric', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, temperature: '99.6' });

        expect(patient).toEqual({ ...patient, temperature: null });
    });

    test('age should be cast to number when value from dto is numeric string', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, age: '30' });

        expect(patient).toEqual(patient);
    });

    test('age should be null when missing from dto', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, age: undefined });

        expect(patient).toEqual({ ...patient, age: null });
    });

    test('blood pressure should be null when missing from dto', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, blood_pressure: undefined });

        expect(patient).toEqual({ ...patient, bloodPressure: null });
    });

    test('blood pressure should be null when diastolic value from dto is missing', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, blood_pressure: '120/' });

        expect(patient).toEqual({ ...patient, bloodPressure: null });
    });

    test('blood pressure should be null when systolic value from dto is missing', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, blood_pressure: '/80' });

        expect(patient).toEqual({ ...patient, bloodPressure: null });
    });

    test('blood pressure should be null when diastolic value from dto is invalid', () => {
        const patient: Patient = patientMapper.toDomain({ ...patientDTO, blood_pressure: '120/thirty-three' });

        expect(patient).toEqual({ ...patient, bloodPressure: null });
    });
});