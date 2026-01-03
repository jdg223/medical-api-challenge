import type { Patient } from "../Patient";
import { PatientAlerts } from "../PatientAlerts";
import type { PatientEvaluation } from "../PatientEvaluation";

import type { Alert } from "../../../../shared/alerts/Alert";
import type { AlertStrategy } from "../../../../shared/alerts/AlertStrategy";

export class DataQualityAlert implements AlertStrategy<PatientEvaluation, PatientAlerts> {
    public constructor(private readonly excludeProperties: string[] = []) { }

    public alert(evaluation: PatientEvaluation): Alert<PatientAlerts> {
        const patientProperties = Object
            .keys(evaluation.patient)
            .filter((property) => !this.excludeProperties.includes(property));

        return {
            name: PatientAlerts.DATA_QUALITY_ISSUES,
            triggered: patientProperties.some((property) => evaluation.patient[property as keyof Patient] === null)
        };
    }
}