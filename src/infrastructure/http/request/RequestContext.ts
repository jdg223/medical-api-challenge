export interface RequestContext {
    url: string;
    method: string;
    headers: Headers;
    body?: any;
}