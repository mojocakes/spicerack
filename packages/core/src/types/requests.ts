export type TRequestConfig = {};

export type TAPIRequestType =
    | 'DELETE'
    | 'GET'
    | 'PATCH'
    | 'POST'
    | 'PUT'
;

export type TApiRequestConfig = TRequestConfig & {
    body?: Record<string, any>;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    url: string;
    method: TAPIRequestType;
}

export type TApiResponse<T> = {
    data: T;
}

export type TPaginatedApiResponse<T> = {
    page: number;
    per_page: number;
    total: number;
} & TApiResponse<T>;

export type TRequestBuilderConfig<Q, RQ> = {
    query?: Partial<Q>,
    requestConfig?: Partial<RQ>,
};
