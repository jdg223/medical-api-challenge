import { expect, test, describe, spyOn } from "bun:test";

import type { Patient } from "../../entities/patients/Patient";

import { GetPatients } from "./GetPatients";

import type { EntityMapper } from "../../repositories/EntityMapper";
import type { PatientDTO } from "../../repositories/patients/PatientDTO";

import { HttpPatientRepository } from "../../repositories/patients/HttpPatientRepository";
import type { RequestBuilder } from "../../../infrastructure/http/request/RequestBuilder";

const patientRepository = new HttpPatientRepository({
    baseUrl: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
}, {} as RequestBuilder, [], {} as EntityMapper<Patient, PatientDTO>);

const patients: Patient[] = [];

describe('GetPatients', () => {
    test('should return all patients', async () => {
        spyOn(patientRepository, "getAll").mockResolvedValue(patients);

        const useCase = new GetPatients(patientRepository);

        await useCase.execute().then((result) => {
            expect(result).toEqual(patients);
        });
    });
});