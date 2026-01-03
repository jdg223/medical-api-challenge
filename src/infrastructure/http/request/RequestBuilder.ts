import { HttpRequest } from './HttpRequest';

export class RequestBuilder {
    private method: string = 'GET';
    private url: string = '';
    private headers: Headers = new Headers();
    private body?: any;

    public constructor() { }

    public setMethod(method: string): RequestBuilder {
        this.method = method;
        return this;
    }

    public setUrl(url: string): RequestBuilder {
        this.url = url;
        return this;
    }

    public setHeaders(headers: Record<string, string>): RequestBuilder {
        this.headers = new Headers();

        Object.entries(headers).forEach(([key, value]) => {
            this.headers.append(key, value);
        });

        return this;
    }

    public addHeader(key: string, value: string): RequestBuilder {
        this.headers.append(key, value);

        return this;
    }

    public setBody(body: any): RequestBuilder {
        this.body = JSON.stringify(body);

        return this;
    }

    public setPagination(page: number, limit: number): RequestBuilder {
        const url = new URL(this.url);

        url.searchParams.set('page', page.toString());
        url.searchParams.set('limit', limit.toString());

        this.url = url.toString();

        return this;
    }

    public build(): HttpRequest {
        return new HttpRequest(
            this.method,
            this.url,
            this.headers,
            this.body
        );
    }
}