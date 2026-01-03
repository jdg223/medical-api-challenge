import type { UseCase } from "../UseCase";

import type { Patient } from "../../entities/patients/Patient";

import type { PatientRepository } from "../../repositories/patients/PatientRepository";

export class GetPatients implements UseCase<void, Promise<Patient[]>> {
    public constructor(private readonly repository: PatientRepository) { }

    public async execute(): Promise<Patient[]> {
        return this.repository.getAll();
    }
}
