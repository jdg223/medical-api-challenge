import { expect, test, describe, mock } from "bun:test";

import type { RequestContext } from "../../../request/RequestContext";

import type { NextFunction } from "../Middleware";
import { RetryMiddleware } from "./RetryMiddleware";

describe('RetryMiddleware', () => {
    test('should retry request on retryable error code', async () => {
        const middleware = new RetryMiddleware({
            maxRetries: 2,
            backoffFactor: 1, // fast for test
            retryableInternalCodes: [503]
        });

        const context: RequestContext = {
            url: "https://example.com",
            method: "GET",
            headers: new Headers(),
            body: undefined
        };

        let attempts = 0;
        const next: NextFunction = mock(async () => {
            attempts++;
            if (attempts <= 2) {
                return new Response("unavailable", { status: 503 });
            }
            return new Response("ok", { status: 200 });
        });

        const response = await middleware.execute(context, next);

        expect(response.status).toBe(200);
        expect(next).toHaveBeenCalledTimes(3); // 2 failures + 1 success
    });

    test('should stop retrying after max retries', async () => {
        const middleware = new RetryMiddleware({
            maxRetries: 2,
            backoffFactor: 1,
            retryableInternalCodes: [503]
        });

        const context: RequestContext = {
            url: "https://example.com",
            method: "GET",
            headers: new Headers(),
            body: undefined
        };

        const next: NextFunction = mock(async () => {
            return new Response("unavailable", { status: 503 });
        });

        const response = await middleware.execute(context, next);

        expect(response.status).toBe(503);
        expect(next).toHaveBeenCalledTimes(3); // Initial + 2 retries
    });
});