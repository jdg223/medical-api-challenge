import type { Assessment } from "./src/domain/entities/assessments/Assessment";

import { AgeRisk } from "./src/domain/entities/patients/risks/AgeRisk";
import { BloodPressureRisk } from "./src/domain/entities/patients/risks/BloodPressureRisk";
import { TemperatureRisk } from "./src/domain/entities/patients/risks/TemperatureRisk";

import { FeverAlert } from "./src/domain/entities/patients/alerts/FeverAlert";
import { DataQualityAlert } from "./src/domain/entities/patients/alerts/DataQualityAlert";
import { HighRiskAlert } from "./src/domain/entities/patients/alerts/HighRiskAlert";

import { ValidateAge } from "./src/domain/repositories/patients/validators/ValidateAge";
import { ValidateTemperature } from "./src/domain/repositories/patients/validators/ValidateTemperature";
import { ValidateBloodPressure } from "./src/domain/repositories/patients/validators/ValidateBloodPressure";

import { IsJson } from "./src/infrastructure/http/response/validators/IsJson";
import { HasRequiredProperties } from "./src/infrastructure/http/response/validators/HasRequiredProperties";

import { PatientMapper } from "./src/domain/repositories/patients/PatientMapper";
import { RequestBuilder } from "./src/infrastructure/http/request/RequestBuilder";
import { HttpPatientRepository } from "./src/domain/repositories/patients/HttpPatientRepository";

import { GetPatients } from "./src/domain/use-cases/patients/GetPatients";
import { PatientAlerts } from "./src/domain/entities/patients/PatientAlerts";
import { EvaluatePatient } from "./src/domain/use-cases/patients/EvaluatePatient";
import { GetPatientRisks } from "./src/domain/use-cases/patients/GetPatientRisks";
import { GetPatientAlerts } from "./src/domain/use-cases/patients/GetPatientAlerts";
import { SubmitAssessment } from "./src/domain/use-cases/assessments/SubmitAssessment";

import type { HttpConfig } from "./src/config/HttpConfig";
import { HttpAssessmentRepository } from "./src/domain/repositories/assessments/HttpAssessmentRepository";

const config: HttpConfig = {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    headers: {
        "x-api-key": process.env.API_KEY || "",
    }
};
const repository = new HttpPatientRepository(
    config,
    new RequestBuilder(),
    [new IsJson(), new HasRequiredProperties(['data', 'pagination'])],
    new PatientMapper(new ValidateAge(), new ValidateBloodPressure(), new ValidateTemperature())
);
const getPatients = new GetPatients(repository);
const evaluatePatient = new EvaluatePatient(
    new GetPatientRisks([new AgeRisk(), new BloodPressureRisk(), new TemperatureRisk()])
);
const getPatientAlerts = new GetPatientAlerts([new FeverAlert(), new DataQualityAlert(), new HighRiskAlert()]);
const submitAssessment = new SubmitAssessment(new HttpAssessmentRepository(config, new RequestBuilder()));

async function main() {
    const patients = await getPatients.execute();
    const allAlerts: Assessment = {
        high_risk_patients: [],
        fever_patients: [],
        data_quality_issues: [],
    };

    for (const patient of patients) {
        const evaluation = evaluatePatient.execute(patient);
        const alerts = getPatientAlerts.execute(evaluation);

        alerts.forEach(alert => {
            if (alert.name === PatientAlerts.HIGH_RISK && alert.triggered) {
                allAlerts.high_risk_patients.push(evaluation.patient.id);
            }

            if (alert.name === PatientAlerts.FEVER && alert.triggered) {
                allAlerts.fever_patients.push(evaluation.patient.id);
            }

            if (alert.name === PatientAlerts.DATA_QUALITY_ISSUES && alert.triggered) {
                allAlerts.data_quality_issues.push(evaluation.patient.id);
            }
        });
    }

    const feedback = await submitAssessment.execute(allAlerts);

    console.log(feedback);
}

main();
