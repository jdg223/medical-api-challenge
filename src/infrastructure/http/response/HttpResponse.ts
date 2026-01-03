import type { Validator } from "../../../shared/Validator";

export class HttpResponse extends Response {
    public constructor(response: Response) {
        super(response.body, response);
    }

    public async hasValidBody(validators: Validator<Response>[]): Promise<boolean> {
        for (const validator of validators) {
            if (!(await validator.isValid(this))) {
                return false;
            }
        }

        return true;
    }
}