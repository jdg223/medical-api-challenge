import type { PatientDTO } from "../PatientDTO";
import type { Validator } from "../../../../shared/Validator";

export class ValidateAge implements Validator<PatientDTO> {
    public constructor() { }

    public isValid(patient: PatientDTO): boolean {
        if (!patient.age) {
            return false;
        }

        if (!Number.isFinite(+patient.age)) {
            return false;
        }

        return true;
    }
}