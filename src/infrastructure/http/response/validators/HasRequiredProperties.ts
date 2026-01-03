import type { Validator } from "../../../../shared/Validator";

export class HasRequiredProperties implements Validator<Response> {
    public constructor(private requiredProperties: string[]) { }

    public async isValid(response: Response): Promise<boolean> {
        const body = await response.clone().json();

        if (!body) {
            return false;
        }

        return this.requiredProperties.every((property) => body.hasOwnProperty(property));
    }
}