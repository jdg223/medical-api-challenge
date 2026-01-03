import type { RequestContext } from "./RequestContext";
import { HttpResponse } from "../response/HttpResponse";

import type { Middleware, NextFunction } from "./middleware/Middleware";

export class HttpRequest extends Request {
    private middleware: Middleware[] = [];

    public constructor(
        method: string,
        url: string,
        headers: Headers,
        body?: any
    ) { super(url, { method, headers, body }); }

    public use(middleware: Middleware): HttpRequest {
        this.middleware.push(middleware);
        return this;
    }

    public async execute(): Promise<HttpResponse> {
        const context: RequestContext = {
            url: this.url,
            method: this.method,
            headers: this.headers,
            body: this.body
        };

        const finalHandler: NextFunction = async () => {
            const request = new Request(context.url, {
                method: context.method,
                headers: context.headers,
                body: context.body
            });
            const response = await fetch(request);

            return response;
        };

        const chain = this.middleware.reduceRight(
            (next: NextFunction, currentMiddleware: Middleware) => {
                if (typeof currentMiddleware === 'function') {
                    return async () => currentMiddleware(context, next);
                }
                return async () => currentMiddleware.execute(context, next);
            },
            finalHandler
        );

        const response = await chain();

        if (response.ok) {
            return new HttpResponse(response);
        }

        throw new Error(`Request failed with status ${response.status}`);
    }
}
