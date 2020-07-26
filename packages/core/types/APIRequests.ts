export type IRequestConfig = {};

export type IApiRequestConfig = IRequestConfig & {
    body?: Record<string, any>;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    url: string;
}
