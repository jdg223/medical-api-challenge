import type { PatientDTO } from "../PatientDTO";
import type { Validator } from "../../../../shared/Validator";

export class ValidateTemperature implements Validator<PatientDTO> {
    public constructor() { }

    public isValid(patient: PatientDTO): boolean {
        if (!patient.temperature) {
            return false;
        }

        if (typeof patient.temperature !== 'number') {
            return false;
        }

        return true;
    }
}