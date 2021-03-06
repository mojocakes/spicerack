import axiosLibrary, { AxiosInstance } from 'axios';
import * as Types from '@/types';
import { Service } from '@/core';
import { RequestConfigException } from './exceptions';

export class RestAPIRequest<
    /**
     * The request config.
     */
    C extends Types.Requests.TApiRequestConfig = Types.Requests.TApiRequestConfig,

    /**
     * The returned data.
     */
    D = any,
> extends Service implements Types.Requests.IRequest<C, any> {
    public ready = Promise.resolve();

    /**
     * The axios library we're using to make the actual requests.
     * 
     * @param {AxiosInstance} axios
     */
    protected axios: AxiosInstance = axiosLibrary;

    /**
     * Makes an HTTP API request.
     * 
     * @param {C} config 
     * @returns {Promise<Types.Requests.TRequestResponse>}
     */
    public async send<DO = D>(config: C): Promise<Types.Requests.TRequestResponse<DO, C>> {
        if (!config.url) {
            throw new RequestConfigException('Missing "url" property. Cannot make HTTP request.', { config });
        }

        if (!config.method) {
            throw new RequestConfigException('Missing "method" property. Cannot make HTTP request.', { config });
        }

        const response = await this.axios(config);

        return {
            config,
            data: response.data,
        };
    }
}
