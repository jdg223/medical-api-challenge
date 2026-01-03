import { PatientRisks } from "../PatientRisks";
import { PatientAlerts } from "../PatientAlerts";
import type { PatientEvaluation } from "../PatientEvaluation";

import type { Alert } from "../../../../shared/alerts/Alert";
import type { AlertStrategy } from "../../../../shared/alerts/AlertStrategy";

export class FeverAlert implements AlertStrategy<PatientEvaluation, PatientAlerts> {
    public constructor() { }

    public alert(evaluation: PatientEvaluation): Alert<PatientAlerts> {
        const temperatureRisk = evaluation.risks.find(risk => risk.type === PatientRisks.TEMPERATURE);

        if (!temperatureRisk) {
            throw new Error('Patient temperature was not evaluated.');
        }

        return {
            name: PatientAlerts.FEVER,
            triggered: temperatureRisk.score >= 1
        };
    }
}