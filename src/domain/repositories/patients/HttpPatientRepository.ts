import type { Patient } from "../../entities/patients/Patient";

import type { PatientDTO } from "./PatientDTO";
import type { EntityMapper } from "../EntityMapper";
import type { PatientRepository } from "./PatientRepository";

import type { Validator } from "../../../shared/Validator";
import type { HttpConfig } from "../../../config/HttpConfig";
import type { RequestBuilder } from "../../../infrastructure/http/request/RequestBuilder";
import type { HttpResponseBody } from "../../../infrastructure/http/response/HttpResponseBody";
import { RetryMiddleware } from "../../../infrastructure/http/request/middleware/retry/RetryMiddleware";

export class HttpPatientRepository implements PatientRepository {
    public constructor(
        private readonly config: HttpConfig,
        private readonly requestBuilder: RequestBuilder,
        private readonly responseBodyValidators: Validator<Response>[],
        private readonly entityMapper: EntityMapper<Patient, PatientDTO>,
    ) { }

    public async getAll(): Promise<Patient[]> {
        const patients: Patient[] = [];

        let currentPage: number = 1;

        while (true) {
            const response = await this.paginate(currentPage);

            response.data.forEach((patientDTO) => {
                patients.push(this.entityMapper.toDomain(patientDTO));
            });

            currentPage++;

            if (!response.pagination.hasNext) {
                break;
            }
        }

        return patients;
    }

    private async paginate(page: number = 1, limit: number = 20, retries: number = 0): Promise<HttpResponseBody<PatientDTO[]>> {
        const response = await this.requestBuilder
            .setUrl(`${this.config.baseUrl}/patients`)
            .setHeaders(this.config.headers)
            .setPagination(page, limit)
            .build()
            .use(new RetryMiddleware({
                maxRetries: 5,
                backoffFactor: 2000,
                retryableInternalCodes: [429, 500, 503]
            }))
            .execute();

        if (!await response.hasValidBody(this.responseBodyValidators)) {
            if (retries >= 3) {
                throw new Error(`Failed to validate response body after ${retries} retries`);
            }

            return this.paginate(page, limit, retries + 1);
        }

        return response.json() as Promise<HttpResponseBody<PatientDTO[]>>;
    }
}