import type { Patient } from "../../entities/patients/Patient";

export interface PatientRepository {
    getAll(): Promise<Patient[]>;
}