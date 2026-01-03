export interface HttpResponseBody<Data> {
    data: Data,
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasNext: boolean;
        hasPrevious: boolean;
    },
    metadata: {
        timestamp: string;
        version: string;
        requestId: string;
    }
}