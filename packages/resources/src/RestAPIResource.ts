import { Models, Requests, Resources, Transformers } from '@spicerack/types';
import { ResourceException } from './exceptions';

type TBaseQuery = {
    id?: null | Models.TModelIdentifier;
}

export abstract class RestAPIResource<
    /**
     * The model type
     */
    T extends Models.IModel<T & Models.TDefaultModelProperties>,
    /**
     * Available query parameters
     */
    Q extends TBaseQuery = TBaseQuery,
    /**
     * Available config parameters
     */
    C extends Requests.TApiRequestConfig = Requests.TApiRequestConfig,
    /**
     * Request response type.
     */
    // R extends Object = any,
> implements Resources.IResource<T, Q, C> {
    /**
     * Service used to make API requests.
     * 
     * @var {IRestAPIRequest<C>}
     */
    protected abstract request: Requests.IRestAPIRequest<C>;

    protected abstract responseTransformer: Transformers.ITransformer<any, T>;

    /**
     * Deletes an entity.
     * 
     * @param {TModelIdentifier} id 
     * @returns {Promise<void>}
     */
    public async delete(id: Models.TModelIdentifier): Promise<void> {
        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                method: 'DELETE',
            },
            query: {
                id,
            }
        } as Requests.TRequestBuilderConfig<Q, C>);

        try {
            await this.request.send(requestConfig);
        } catch (e) {
            throw new ResourceException(e, 'Failed to delete resource');
        }
    }

    /**
     * Fetches a single entity by its identitifer.
     * 
     * @param {TModelIdentifier} id 
     * @param {C=} config
     * @returns {Promise<null | T>}
     */
    public async get(id: Models.TModelIdentifier, config?: C): Promise<null | T> {
        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                ...(config || {}),
                method: 'GET',
            },
            query: {
                id,
            },
        } as Requests.TRequestBuilderConfig<Q, C>);

        try {
            const response = await this.request.send(requestConfig);

            if (!response?.response?.data) {
                return null;
            }

            return this.responseTransformer.transform(response.response.data);
        } catch (e) {
            throw new ResourceException(e, 'Failed to get resource');
        }
    }

    /**
     * Fetches multiple entities that match the given query.
     * TODO: This should return a collection instance
     * 
     * @param query 
     */
    public async query(query: Q): Promise<null[] | T[]> {
        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                method: 'GET',
            },
            query,
        } as any as Requests.TRequestBuilderConfig<Q, C>);

        try {
            const response = await this.request.send(requestConfig);

            if (!response?.response?.data || !response?.response?.data.length) {
                return [];
            }

            return response.response.data.map((item: any) => this.responseTransformer.transform(item));
        } catch (e) {
            throw new ResourceException(e, 'Failed to query resource');
        }
    }

    /**
     * Saves a new or existing entity.
     * 
     * @param {T} entity
     * @returns {Promise<T>}
     */
    public async save(entity: T): Promise<T> {
        const id = (entity as Models.IModel<T> & Models.TDefaultModelProperties).id || undefined;

        const requestConfig = await this.makeRequestConfig({
            requestConfig: {
                // TODO: figure out how to type properties available on model instance
                method: entity.data.id ? 'PUT' : 'POST',
            },
            query: {
                id,
            },
        } as Requests.TRequestBuilderConfig<Q, C>);

        requestConfig.body = entity.serialize();

        try {
            const response = await this.request.send(requestConfig);
            return this.responseTransformer.transform(response.response.data);
        } catch (e) {
            throw new ResourceException(e, 'Failed to save resource');
        }

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
        requestConfig: Requests.TRequestBuilderConfig<Q, C>,
        /**
         * Optional config passed to previous request.
         * Useful for getting next page config etc.
         */
        prevRequestConfig?: Requests.TRequestBuilderConfig<Q, C>,
    ): Promise<C>;
}
