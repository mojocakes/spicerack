import { Models } from './models';
import { Generic } from './generic';

export namespace Requests {
    export interface IRequest<
        /**
         * The request config.
         */
        C extends Object = any,

        /**
         * The returned data.
         */
        D = any,
    > extends Generic.IService {
        /**
         * Makes a request.
         * 
         * @param {C} Config
         * @returns {Promise<any>}
         */
        send<DO = D>(config: C): Promise<TRequestResponse<DO, C>>;
    }

    export type TRequestConfig = {};
    
    export type TAPIRequestType =
        | 'DELETE'
        | 'GET'
        | 'PATCH'
        | 'POST'
        | 'PUT'
    ;

    export type TRequestResponse<D = any, C = any> = {
        config: C,
        data: D,
    }
    
    export type TApiRequestConfig<T = {}> = TRequestConfig & {
        body?: Record<string, any>;
        headers?: Record<string, string>;
        params?: Record<string, any>;
        url: string;
        method: TAPIRequestType;
    } & T;
    
    export type TApiResponse<T> = {
        data: T;
    }

    export type TPaginatedApiResponse<T> = {
        page: number;
        per_page: number;
        total: number;
    } & TApiResponse<T>;

    export type TApiResult<T> = {
        requestConfig: TApiRequestConfig;
        response: TApiResponse<T>;
    }
    
    export type TRequestBuilderConfig<Q, RQ> = {
        query?: Partial<Q>,
        requestConfig?: Partial<RQ>,
    };

    export type TBaseModelQuery = {
        id?: null | Models.TModelIdentifier;
    }
}
