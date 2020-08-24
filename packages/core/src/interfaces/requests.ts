import { TRequestConfig, TApiRequestConfig, TApiResponse } from '../types/requests';

export interface IRequest<
    /**
     * The config type.
     */
    C extends Object = TRequestConfig,
> {
    /**
     * Makes a request.
     * 
     * @param {C} config 
     * @returns {Promise<any>}
     */
    send(config: C): Promise<any>;
}

export interface IRestAPIRequest<
    /**
     * The config type.
     */
    C extends Object = TApiRequestConfig,
> extends IRequest<C> {
    /**
     * Makes a request.
     * 
     * @param {C} config 
     * @returns {Promise<T>}
     */
    send<T = any>(config: C): Promise<TApiResponse<T>>;
}
