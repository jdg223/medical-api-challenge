export interface Feedback {
    success: boolean,
    message: string,
    results: {
        score: number,
        percentage: number,
        status: string,
        breakdown: {
            high_risk: Breakdown,
            fever: Breakdown,
            data_quality: Breakdown
        }
    },
    feedback: {
        strengths: string[],
        issues: string[]
    },
    attempt_number: number,
    remaining_attempts: number,
    is_personal_best: boolean,
    can_resubmit: boolean
}

interface Breakdown {
    score: number,
    max: number,
    correct: number,
    submitted: number,
    matches: number
}