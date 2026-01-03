import type { Feedback } from "../../entities/feedback/Feedback";
import type { Assessment } from "../../entities/assessments/Assessment";

export interface AssessmentRepository {
    submitAssessment(assessment: Assessment): Promise<Feedback>;
}