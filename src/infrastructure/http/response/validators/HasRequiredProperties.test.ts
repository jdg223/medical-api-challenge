import { expect, test, describe } from "bun:test";

import { HttpResponse } from "../HttpResponse";

import { HasRequiredProperties } from "./HasRequiredProperties";

describe('HasRequiredProperties', () => {
    test('should return true if required properties are present', async () => {
        const validator = new HasRequiredProperties(["foo"]);
        const response = new HttpResponse(new Response(JSON.stringify({ foo: "bar" })));

        expect(await validator.isValid(response)).toBe(true);
    });

    test('should return false if required properties are missing', async () => {
        const validator = new HasRequiredProperties(["foo"]);
        const response = new HttpResponse(new Response(JSON.stringify({ bar: "baz" })));

        expect(await validator.isValid(response)).toBe(false);
    });
});