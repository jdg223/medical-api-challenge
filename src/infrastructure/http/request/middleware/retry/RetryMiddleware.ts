import type { RetryRequest } from './RetryRequest';
import type { RequestContext } from '../../../request/RequestContext';

import type { MiddlewareStrategy, NextFunction } from './../Middleware';

export class RetryMiddleware implements MiddlewareStrategy {
    public constructor(private policy: RetryRequest) { }

    public async execute(context: RequestContext, next: NextFunction): Promise<Response> {
        let attempts = 0;

        const maxRetries = this.policy.maxRetries;
        const backoffFactor = this.policy.backoffFactor;
        const retryableCodes = this.policy.retryableInternalCodes;

        while (true) {
            try {
                const response = await next();

                if (response.ok || attempts >= maxRetries || !retryableCodes.includes(response.status)) {
                    return response;
                }

                attempts++;

                await this.delay(attempts * backoffFactor);
            } catch (error) {
                if (attempts >= maxRetries) {
                    throw error;
                }

                attempts++;

                await this.delay(attempts * backoffFactor);
            }
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
