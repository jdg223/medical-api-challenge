import type { UseCase } from "../UseCase";

import type { PatientAlerts } from "../../entities/patients/PatientAlerts";
import type { PatientEvaluation } from "../../entities/patients/PatientEvaluation";

import type { Alert } from "../../../shared/alerts/Alert";
import type { AlertStrategy } from "../../../shared/alerts/AlertStrategy";

export class GetPatientAlerts implements UseCase<PatientEvaluation, Alert<PatientAlerts>[]> {
    public constructor(private readonly strategies: AlertStrategy<PatientEvaluation, PatientAlerts>[]) { }

    public execute(evaluation: PatientEvaluation): Alert<PatientAlerts>[] {
        const alerts: Alert<PatientAlerts>[] = [];

        for (const strategy of this.strategies) {
            alerts.push(strategy.alert(evaluation));
        }

        return alerts;
    }
}
