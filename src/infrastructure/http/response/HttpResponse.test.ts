import { expect, test, describe } from "bun:test";

import { HttpResponse } from "./HttpResponse";

import { IsJson } from "./validators/IsJson";

describe('HttpResponse', () => {
    test('should return true for valid response body', async () => {
        const response = new HttpResponse(new Response(JSON.stringify({ foo: "bar" })));

        expect(await response.hasValidBody([new IsJson()])).toBe(true);
    });

    test('should return false for invalid response body', async () => {
        const response = new HttpResponse(new Response("not json"));

        expect(await response.hasValidBody([new IsJson()])).toBe(false);
    });
});