import axiosLibrary, { AxiosInstance } from 'axios';
import * as Types from '@spicerack/types';

export class RestAPIRequest<
    /**
     * The config type.
     */
    C extends Types.Requests.TApiRequestConfig = Types.Requests.TApiRequestConfig,
> implements Types.Requests.IRestAPIRequest<C> {
    constructor(protected axios: AxiosInstance = axiosLibrary) {
        //
    }

    /**
     * Makes a request.
     * 
     * @param {C} config 
     * @returns {Promise<TApiResult<T>>}
     */
    public async send<T = any>(config: C): Promise<Types.Requests.TApiResult<T>> {
        const response = await this.axios(config);

        return {
            requestConfig: config,
            response,
        };
    }
}
