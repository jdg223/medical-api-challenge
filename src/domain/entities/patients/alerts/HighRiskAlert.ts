import { PatientAlerts } from "../PatientAlerts";

import type { Alert } from "../../../../shared/alerts/Alert";
import type { AlertStrategy } from "../../../../shared/alerts/AlertStrategy";
import type { PatientEvaluation } from "../PatientEvaluation";

export class HighRiskAlert implements AlertStrategy<PatientEvaluation, PatientAlerts> {
    public constructor() { }

    public alert(evaluation: PatientEvaluation): Alert<PatientAlerts> {
        return {
            name: PatientAlerts.HIGH_RISK,
            triggered: evaluation.risks.reduce((totalRiskScore, risk) => totalRiskScore + risk.score, 0) >= 4
        };
    }
}