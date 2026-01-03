export interface RetryRequest {
    maxRetries: number;
    backoffFactor: number;
    retryableInternalCodes: number[];
}