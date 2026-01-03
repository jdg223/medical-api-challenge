import type { Patient } from "../../entities/patients/Patient";

import type { PatientDTO } from "./PatientDTO";
import type { Validator } from "../../../shared/Validator";

export class PatientMapper {
    public constructor(
        private readonly age: Validator<PatientDTO>,
        private readonly bloodPressure: Validator<PatientDTO>,
        private readonly temperature: Validator<PatientDTO>
    ) { }

    public toDomain(patientDTO: PatientDTO): Patient {
        return {
            id: patientDTO.patient_id || '',
            name: patientDTO.name || null,
            age: this.convertAge(patientDTO),
            gender: patientDTO.gender || null,
            bloodPressure: this.convertBloodPressure(patientDTO),
            temperature: this.convertTemperature(patientDTO),
            visitDate: patientDTO.visit_date || null,
            diagnosis: patientDTO.diagnosis || null,
            medications: patientDTO.medications || null
        };
    }

    private convertAge(patient: PatientDTO): number | null {
        let age = patient.age;

        if (!this.age.isValid(patient)) {
            age = null;
        }

        if (typeof age === 'string') {
            age = +age;
        }

        return age || null;
    }

    private convertBloodPressure(patient: PatientDTO): string | null {
        let bloodPressure = patient.blood_pressure;

        if (!this.bloodPressure.isValid(patient)) {
            bloodPressure = null;
        }

        return bloodPressure || null;
    }

    private convertTemperature(patient: PatientDTO): number | null {
        let temperature = patient.temperature;

        if (!this.temperature.isValid(patient)) {
            temperature = null;
        }

        return temperature as number || null;
    }
}