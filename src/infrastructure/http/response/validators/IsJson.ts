import type { Validator } from "../../../../shared/Validator";

export class IsJson implements Validator<Response> {
    public constructor() { }

    public async isValid(response: Response): Promise<boolean> {
        try {
            await response.clone().json();
            return true;
        } catch (error) {
            return false;
        }
    }
}