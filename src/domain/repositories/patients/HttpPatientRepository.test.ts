import { expect, test, describe, mock } from "bun:test";

import type { Patient } from "../../entities/patients/Patient";

import type { PatientDTO } from "./PatientDTO";
import type { EntityMapper } from "../EntityMapper";

import type { Validator } from "../../../shared/Validator";

import type { HttpConfig } from "../../../config/HttpConfig";
import { HttpPatientRepository } from "./HttpPatientRepository";
import { HttpResponse } from "../../../infrastructure/http/response/HttpResponse";
import type { HttpRequest } from "../../../infrastructure/http/request/HttpRequest";
import type { RequestBuilder } from "../../../infrastructure/http/request/RequestBuilder";
import type { HttpResponseBody } from "../../../infrastructure/http/response/HttpResponseBody";

describe('HttpPatientRepository', () => {
    const mockConfig: HttpConfig = {
        baseUrl: "https://api.example.com",
        headers: { "Content-Type": "application/json" }
    };

    const mockEntityMapper = {
        toDomain: (dto: PatientDTO) => ({ id: dto.patient_id || null, name: dto.name || null } as Patient),
    } as EntityMapper<Patient, PatientDTO>;

    const createMockRequestBuilder = (responses: HttpResponseBody<PatientDTO[]>[]) => {
        let callCount = 0;

        const mockExecute = mock(async () => {
            const body = responses[callCount] || responses[responses.length - 1]; // Use last if overflow
            callCount++;
            return new HttpResponse(new Response(JSON.stringify(body)));
        });

        const mockUse = mock(() => mockHttpRequest);
        const mockHttpRequest = {
            use: mockUse,
            execute: mockExecute
        } as unknown as HttpRequest;

        const mockSetPagination = mock(() => mockBuilder);
        const mockBuilder = {
            setUrl: mock(() => mockBuilder),
            setHeaders: mock(() => mockBuilder),
            setPagination: mockSetPagination,
            build: mock(() => mockHttpRequest)
        } as unknown as RequestBuilder;

        return {
            builder: mockBuilder,
            request: mockHttpRequest,
            executeSpy: mockExecute,
            useSpy: mockUse,
            setPaginationSpy: mockSetPagination
        };
    };

    test('should return all patients from single page', async () => {
        const response: HttpResponseBody<PatientDTO[]> = {
            data: [{ patient_id: "1", name: "John" }, { patient_id: "2", name: "Jane" }],
            pagination: { page: 1, limit: 10, total: 2, hasNext: false, hasPrevious: false },
            metadata: {
                timestamp: "2023-01-01T00:00:00Z",
                version: "1.0.0",
                requestId: "1234567890"
            }
        };
        const { builder, setPaginationSpy, useSpy } = createMockRequestBuilder([response]);
        const repo = new HttpPatientRepository(mockConfig, builder, [], mockEntityMapper);
        const result = await repo.getAll();

        expect(result).toHaveLength(2);
        expect(result[0]?.id).toBe("1");
        expect(result[1]?.id).toBe("2");

        // Verify defaults
        expect(setPaginationSpy).toHaveBeenCalledWith(1, 20);

        // Verify Middleware
        const calls = useSpy.mock.calls as any[];
        const middleware = calls[0]?.[0];
        expect(middleware).toBeDefined();
        expect(middleware.constructor.name).toBe("RetryMiddleware");
    });

    test('should accumulate patients from multiple pages', async () => {
        const page1: HttpResponseBody<PatientDTO[]> = {
            data: [{ patient_id: "1", name: "John" }],
            pagination: { page: 1, limit: 1, total: 2, hasNext: true, hasPrevious: false },
            metadata: {
                timestamp: "2023-01-01T00:00:00Z",
                version: "1.0.0",
                requestId: "1234567890"
            }
        };
        const page2: HttpResponseBody<PatientDTO[]> = {
            data: [{ patient_id: "2", name: "Jane" }],
            pagination: { page: 2, limit: 1, total: 2, hasNext: false, hasPrevious: true },
            metadata: {
                timestamp: "2023-01-01T00:00:00Z",
                version: "1.0.0",
                requestId: "1234567890"
            }
        };

        const { builder } = createMockRequestBuilder([page1, page2]);
        const repo = new HttpPatientRepository(mockConfig, builder, [], mockEntityMapper);
        const result = await repo.getAll();

        expect(result).toHaveLength(2);
        expect(result[0]?.id).toBe("1");
        expect(result[1]?.id).toBe("2");
    });

    test('should retry pagination on invalid body', async () => {
        const validResponse: HttpResponseBody<PatientDTO[]> = {
            data: [{ patient_id: "1", name: "John" }],
            pagination: { page: 1, limit: 10, total: 1, hasNext: false, hasPrevious: false },
            metadata: {
                timestamp: "2023-01-01T00:00:00Z",
                version: "1.0.0",
                requestId: "1234567890"
            }
        };
        const { builder, executeSpy } = createMockRequestBuilder([validResponse, validResponse]); // Provide enough responses

        // Mock validator to fail first time, then succeed
        let validationAttempts = 0;
        const mockValidator = {
            isValid: async () => {
                validationAttempts++;
                return validationAttempts > 1;
            }
        } as Validator<Response>;
        const repo = new HttpPatientRepository(mockConfig, builder, [mockValidator], mockEntityMapper);
        const result = await repo.getAll();

        expect(result).toHaveLength(1);
        expect(executeSpy).toHaveBeenCalledTimes(2); // Initial + 1 retry
    });

    test('should stop retrying validation after max attempts', async () => {
        const response: HttpResponseBody<PatientDTO[]> = {
            data: [],
            pagination: { page: 1, limit: 10, total: 0, hasNext: false, hasPrevious: false },
            metadata: {
                timestamp: "2023-01-01T00:00:00Z",
                version: "1.0.0",
                requestId: "1234567890"
            }
        };
        const { builder, executeSpy } = createMockRequestBuilder([response, response, response, response, response]);
        const mockValidator = {
            isValid: async () => { return false; } // Always fail
        } as Validator<Response>;
        const repo = new HttpPatientRepository(mockConfig, builder, [mockValidator], mockEntityMapper);

        expect(repo.getAll()).rejects.toThrow("Failed to validate response body after 3 retries");
        expect(executeSpy).toHaveBeenCalledTimes(4);
    });

    test('should handle empty patient list', async () => {
        const response: HttpResponseBody<PatientDTO[]> = {
            data: [],
            pagination: { page: 1, limit: 10, total: 0, hasNext: false, hasPrevious: false },
            metadata: {
                timestamp: "2023-01-01T00:00:00Z",
                version: "1.0.0",
                requestId: "1234567890"
            }
        };
        const { builder } = createMockRequestBuilder([response]);
        const repo = new HttpPatientRepository(mockConfig, builder, [], mockEntityMapper);
        const result = await repo.getAll();

        expect(result).toHaveLength(0);
    });
});