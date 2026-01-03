import { describe, it, expect, mock, beforeEach } from "bun:test";

import type { Feedback } from "../../entities/feedback/Feedback";
import type { Assessment } from "../../entities/assessments/Assessment";

import type { HttpConfig } from "../../../config/HttpConfig";
import { HttpAssessmentRepository } from "./HttpAssessmentRepository";
import { HttpRequest } from "../../../infrastructure/http/request/HttpRequest";
import { HttpResponse } from "../../../infrastructure/http/response/HttpResponse";
import { RequestBuilder } from "../../../infrastructure/http/request/RequestBuilder";

describe('HttpAssessmentRepository', () => {
    let mockRequestBuilder: RequestBuilder;
    let mockHttpRequest: HttpRequest;
    let mockHttpResponse: HttpResponse;
    let repository: HttpAssessmentRepository;
    let config: HttpConfig;

    beforeEach(() => {
        config = {
            baseUrl: "http://test-api.com",
            headers: { "x-api-key": "test-key" }
        };

        // Mock HttpResponse
        mockHttpResponse = {
            json: mock(() => Promise.resolve({ success: true } as any)),
        } as unknown as HttpResponse;

        // Mock HttpRequest
        mockHttpRequest = {
            execute: mock(() => Promise.resolve(mockHttpResponse)),
        } as unknown as HttpRequest;

        mockRequestBuilder = new RequestBuilder();

        // Mocking chainable methods
        mockRequestBuilder.setMethod = mock(() => mockRequestBuilder);
        mockRequestBuilder.setUrl = mock(() => mockRequestBuilder);
        mockRequestBuilder.setHeaders = mock(() => mockRequestBuilder);
        mockRequestBuilder.addHeader = mock(() => mockRequestBuilder);
        mockRequestBuilder.setBody = mock(() => mockRequestBuilder);

        // Mock build to return the mockHttpRequest
        mockRequestBuilder.build = mock(() => mockHttpRequest);

        repository = new HttpAssessmentRepository(config, mockRequestBuilder);
    });

    it('should submit an assessment successfully', async () => {
        const assessment: Assessment = {
            high_risk_patients: [],
            fever_patients: [],
            data_quality_issues: []
        };

        const expectedFeedback: Feedback = {
            success: true,
            message: "Success",
            results: {
                score: 100,
                percentage: 100,
                status: "PASS",
                breakdown: {
                    high_risk: { score: 0, max: 0, correct: 0, submitted: 0, matches: 0 },
                    fever: { score: 0, max: 0, correct: 0, submitted: 0, matches: 0 },
                    data_quality: { score: 0, max: 0, correct: 0, submitted: 0, matches: 0 }
                }
            },
            feedback: { strengths: [], issues: [] },
            attempt_number: 1,
            remaining_attempts: 1,
            is_personal_best: true,
            can_resubmit: false
        };

        // Update mock response to return expected feedback
        (mockHttpResponse.json as any).mockResolvedValue(expectedFeedback);

        const result = await repository.submitAssessment(assessment);

        expect(result).toEqual(expectedFeedback);

        // Verify RequestBuilder calls
        expect(mockRequestBuilder.setMethod).toHaveBeenCalledWith("POST");
        expect(mockRequestBuilder.setUrl).toHaveBeenCalledWith(`${config.baseUrl}/submit-assessment`);
        expect(mockRequestBuilder.setHeaders).toHaveBeenCalledWith(config.headers);
        expect(mockRequestBuilder.addHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
        expect(mockRequestBuilder.setBody).toHaveBeenCalledWith(assessment);
        expect(mockRequestBuilder.build).toHaveBeenCalled();

        // Verify HttpRequest execution
        expect(mockHttpRequest.execute).toHaveBeenCalled();
    });
});