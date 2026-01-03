import type { RequestContext } from "../RequestContext";


export type NextFunction = () => Promise<Response>;

export interface MiddlewareStrategy {
    execute(context: RequestContext, next: NextFunction): Promise<Response>;
}

export type MiddlewareFunction = (context: RequestContext, next: NextFunction) => Promise<Response>;

export type Middleware = MiddlewareStrategy | MiddlewareFunction;
