import type { PatientDTO } from "../PatientDTO";
import type { Validator } from "../../../../shared/Validator";

export class ValidateBloodPressure implements Validator<PatientDTO> {
    public constructor() { }

    public isValid(patient: PatientDTO): boolean {
        if (!patient.blood_pressure ||
            patient.blood_pressure.split('/').length !== 2 ||
            patient.blood_pressure.split('/').some((value) => !Number.isFinite(+value) || value === '')) {
            return false;
        }

        return true;
    }
}