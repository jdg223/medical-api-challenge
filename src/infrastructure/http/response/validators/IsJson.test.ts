import { expect, test, describe } from "bun:test";

import { HttpResponse } from "../HttpResponse";

import { IsJson } from "./IsJson";

describe('IsJson', () => {
    test('should return true for valid JSON response', async () => {
        const validator = new IsJson();
        const response = new HttpResponse(new Response(JSON.stringify({ foo: "bar" })));

        expect(await validator.isValid(response)).toBe(true);
    });

    test('should return false for invalid JSON response', async () => {
        const validator = new IsJson();
        const response = new HttpResponse(new Response("not json"));

        expect(await validator.isValid(response)).toBe(false);
    });
});