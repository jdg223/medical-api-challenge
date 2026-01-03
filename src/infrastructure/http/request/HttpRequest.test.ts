import { expect, test, describe, spyOn } from "bun:test";

import { RequestBuilder } from "./RequestBuilder";
import type { RequestContext } from "./RequestContext";

import type { NextFunction, MiddlewareStrategy } from "./middleware/Middleware";

describe('HttpRequest', () => {
    test('should execute request with middleware', async () => {
        const mockFetch = spyOn(global, 'fetch').mockResolvedValueOnce(new Response('ok'));

        const request = new RequestBuilder()
            .setMethod("POST")
            .setUrl("https://example.com")
            .setHeaders({ "Content-Type": "application/json" })
            .build();

        request.use((context: RequestContext, next: NextFunction) => {
            context.url = "https://example.com/modified";
            return next();
        });

        await request.execute();

        expect(mockFetch).toHaveBeenCalledWith(new Request("https://example.com/modified", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: undefined
        }));
    });

    test('should execute request with class-based middleware', async () => {
        const mockFetch = spyOn(global, 'fetch').mockResolvedValueOnce(new Response('ok'));

        const request = new RequestBuilder()
            .setMethod("GET")
            .setUrl("https://example.com")
            .build();

        class TestMiddleware implements MiddlewareStrategy {
            async execute(context: RequestContext, next: NextFunction): Promise<Response> {
                context.headers.set("X-Test", "true");
                return next();
            }
        }

        request.use(new TestMiddleware());

        await request.execute();

        const expectedHeaders = new Headers();
        expectedHeaders.set("X-Test", "true");

        expect(mockFetch).toHaveBeenCalledWith(new Request("https://example.com", {
            method: "GET",
            headers: expectedHeaders,
            body: undefined
        }));
    });

    test('should throw error when request fails', async () => {
        spyOn(global, 'fetch').mockResolvedValueOnce(new Response('error', { status: 500 }));

        const request = new RequestBuilder()
            .setMethod("GET")
            .setUrl("https://example.com")
            .build();

        expect(request.execute()).rejects.toThrow("Request failed with status 500");
    });
});