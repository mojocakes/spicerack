import { decorate, injectable } from '@spicerack/core';
import axios, { AxiosRequestConfig } from 'axios';
import { IRestAPIRequest } from '@spicerack/core/src/interfaces/requests';
import { TApiResponse } from '@spicerack/core/src/types/requests';

export class RestAPIRequest<
    /**
     * The config type.
     */
    C = AxiosRequestConfig,
> implements IRestAPIRequest<C> {
    /**
     * Makes a request.
     * 
     * @param {C} config 
     * @returns {Promise<T>}
     */
    public async send<T = any>(config: C): Promise<TApiResponse<T>> {
        return axios(config);
    }
}

decorate(injectable(), RestAPIRequest);
