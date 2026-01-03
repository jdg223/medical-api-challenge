import { describe, it, expect, mock } from "bun:test";

import type { Feedback } from "../../entities/feedback/Feedback";
import type { Assessment } from "../../entities/assessments/Assessment";

import { SubmitAssessment } from "./SubmitAssessment";
import { HttpAssessmentRepository } from "../../repositories/assessments/HttpAssessmentRepository";

describe('SubmitAssessment', () => {
    it('should submit an assessment', async () => {
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

        const mockSubmitAssessment = mock(() => Promise.resolve(expectedFeedback));

        const mockRepository = {
            submitAssessment: mockSubmitAssessment
        } as unknown as HttpAssessmentRepository;

        const submitAssessment = new SubmitAssessment(mockRepository);

        const assessmentData: Assessment = {
            high_risk_patients: [],
            fever_patients: [],
            data_quality_issues: [],
        };

        const result = await submitAssessment.execute(assessmentData);

        expect(result).toEqual(expectedFeedback);
        expect(mockSubmitAssessment).toHaveBeenCalledWith(assessmentData);
        expect(mockSubmitAssessment).toHaveBeenCalledTimes(1);
    });
});