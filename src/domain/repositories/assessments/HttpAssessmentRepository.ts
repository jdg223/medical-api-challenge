import type { Feedback } from "../../entities/feedback/Feedback";
import type { Assessment } from "../../entities/assessments/Assessment";

import type { HttpConfig } from "../../../config/HttpConfig";
import type { RequestBuilder } from "../../../infrastructure/http/request/RequestBuilder";

export class HttpAssessmentRepository {
    public constructor(
        private readonly config: HttpConfig,
        private readonly requestBuilder: RequestBuilder
    ) { }

    public async submitAssessment(assessment: Assessment): Promise<Feedback> {
        const response = await this.requestBuilder
            .setMethod("POST")
            .setUrl(`${this.config.baseUrl}/submit-assessment`)
            .setHeaders(this.config.headers)
            .addHeader('Content-Type', 'application/json')
            .setBody(assessment)
            .build()
            .execute();

        return response.json() as Promise<Feedback>;
    }
}