import { IResource } from '@spicerack/core/src/interfaces/resources';
import { IRestAPIRequest } from '@spicerack/core/src/interfaces/requests';
import { ITransformer } from '@spicerack/core/src/interfaces/transformers';
import { TApiRequestConfig, TApiResponse, TRequestBuilderConfig } from '@spicerack/core/src/types/requests';
import { IModel } from '@spicerack/core/src/interfaces/models';
import { TDefaultModelProperties, TModelIdentifier } from '@spicerack/core/src/types/models'
import { decorate, injectable } from '@spicerack/core';

type TBaseQuery = {
    id?: TModelIdentifier;
}

export abstract class RestAPIResource<
    /**
     * The model type
     */
    T extends IModel<T & TDefaultModelProperties>,
    /**
     * Available query parameters
     */
    Q extends TBaseQuery = TBaseQuery,
    /**
     * Available config parameters
     */
    C extends TApiRequestConfig = TApiRequestConfig,
    /**
     * Request response type.
     */
    // R extends Object = any,
> implements IResource<T, Q, C> {
    /**
     * Service used to make API requests.
     * 
     * @var {IRestAPIRequest<C>}
     */
    protected abstract request: IRestAPIRequest<C>;

    protected abstract responseTransformer: ITransformer<TApiResponse<T>, T[]>;

    /**
     * Deletes an entity.
     * 
     * @param {TModelIdentifier} id 
     * @returns {Promise<void>}
     */
    public async delete(id: TModelIdentifier): Promise<void> {
        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                method: 'DELETE',
            },
            query: {
                id,
            }
        } as TRequestBuilderConfig<Q, C>);

        await this.request.send(requestConfig);
    }

    /**
     * Fetches a single entity by its identitifer.
     * 
     * @param {TModelIdentifier} id 
     * @param {C=} config
     * @returns {Promise<null | T>}
     */
    public async get(id: TModelIdentifier, config?: C): Promise<null | T> {
        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                ...(config || {}),
                method: 'GET',
            },
            query: {
                id,
            },
        } as TRequestBuilderConfig<Q, C>);

        const response = await this.request.send(requestConfig);

        return this.responseTransformer.transform(response)[0];
    }

    /**
     * Fetches multiple entities that match the given query.
     * TODO: This should return a collection instance
     * 
     * @param query 
     */
    public async query(query: Q): Promise<T[]> {
        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                method: 'GET',
            },
            query,
        } as any as TRequestBuilderConfig<Q, C>);

        const response = await this.request.send(requestConfig);

        return this.responseTransformer.transform(response);
    }

    /**
     * Saves a new or existing entity.
     * 
     * @param {T} entity
     * @returns {Promise<T>}
     */
    public async save(entity: T): Promise<T> {
        const id = (entity as IModel<T> & TDefaultModelProperties).id || undefined;

        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                method: 'POST',
            },
            query: {
                id,
            },
        } as TRequestBuilderConfig<Q, C>);

        const response = await this.request.send(requestConfig);

        return this.responseTransformer.transform(response)[0];
    }

    /**
     * Builds the config object for a request.
     * 
     * @param {TRequestBuilderConfig<Q, C>} requestConfig
     * @param {TRequestBuilderConfig<Q, C>=} prevRequestConfig
     * @returns {Promise<C>}
     */
    protected abstract async makeRequestConfig(
        /**
         * Query and request config overrides
         */
        requestConfig: TRequestBuilderConfig<Q, C>,
        /**
         * Optional config passed to previous request.
         * Useful for getting next page config etc.
         */
        prevRequestConfig?: TRequestBuilderConfig<Q, C>,
    ): Promise<C>;
}

decorate(injectable(), RestAPIResource);
