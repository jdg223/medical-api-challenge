import { expect, test, describe } from "bun:test";

import { RequestBuilder } from "./RequestBuilder";

describe('RequestBuilder', () => {
    test('should build a GET request', async () => {
        const requestBuilder = new RequestBuilder();
        const request = requestBuilder
            .setMethod("GET")
            .setUrl("https://example.com")
            .setPagination(1, 10)
            .setHeaders({
                "Content-Type": "application/json",
            })
            .addHeader("Authorization", "Bearer token")
            .setBody({
                name: "John Doe",
                age: 30,
            })
            .build();

        expect(request.method).toBe("GET");
        expect(request.url).toBe("https://example.com/?page=1&limit=10");
        expect(request.headers.get("Content-Type")).toBe("application/json");
        expect(request.headers.get("Authorization")).toBe("Bearer token");
        await request.text().then((body) => {
            expect(body).toEqual(JSON.stringify({ name: "John Doe", age: 30 }));
        });
    });
});