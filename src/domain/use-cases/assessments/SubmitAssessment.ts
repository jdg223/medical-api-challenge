import type { UseCase } from "../UseCase";

import type { Feedback } from "../../entities/feedback/Feedback";
import type { Assessment } from "../../entities/assessments/Assessment";

import type { HttpAssessmentRepository } from "../../repositories/assessments/HttpAssessmentRepository";

export class SubmitAssessment implements UseCase<Assessment, Promise<Feedback>> {
    public constructor(
        private readonly repository: HttpAssessmentRepository
    ) { }

    public async execute(input: Assessment): Promise<Feedback> {
        return this.repository.submitAssessment(input);
    }
}