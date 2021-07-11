// import deepmerge from 'deepmerge';
import '@/requests';
import { Data, Models, Requests, Transformers } from '@/types';
import { Service } from '@/core';
import { ResourceException, ResourceTransformerException } from './exceptions';

// TODO: Move this type to somewhere better
export type TRequestTransformerInput<Q> = {
    query: Q,
} & Partial<Requests.TApiRequestConfig>;

export class DefaultRequestTransformer extends Service implements Transformers.ITransformer<TRequestTransformerInput<any>, Requests.TApiRequestConfig> {
    public ready = Promise.resolve();

    public async transform(config: TRequestTransformerInput<any>): Promise<Requests.TApiRequestConfig> {
        config.params = config.query;
        delete config.query;

        if (!config.url) {
            throw new ResourceTransformerException(`
                No "url" property was provided to the default request transformer.
                The default request transformer does not provide a url.
                Either provide a url when calling "transform" or implement your own transformer.
            `);
        }

        if (!config.method) {
            throw new ResourceTransformerException(`
                No "method" property was provided to the default request transformer.
                The default request transformer does not provide a method.
                Either provide a method when calling "transform" or implement your own transformer.
            `);
        }

        return config as Requests.TApiRequestConfig;
    }

    public async untransform(): Promise<any> {
        throw new ResourceTransformerException('"untransform" not implemented.');
    }
}

export abstract class RestAPIResource<
    /**
     * The model type this resource handles.
     */
    T extends Models.IModel<T & Models.TDefaultModelProperties>,
    /**
     * Available query parameters
     */
    Q extends Requests.TBaseModelQuery = Requests.TBaseModelQuery,
> extends Service implements Data.IRepository<T, Q> {
    /**
     * Transforms raw response data into models.
     */
    protected abstract makeModelTransformer(query?: Q): Promise<Transformers.ITransformer<any, T>>;

    /**
     * Service used to make API requests.
     */
    protected abstract makeRequest(): Promise<Requests.IRequest<Requests.TApiRequestConfig, null | T>>;

    /**
     * Transforms resource queries into request queries.
     * Takes an array of objects that contain the query, and any other stuff it needs.
     */
    protected abstract makeRequestTransformer(): Promise<Transformers.ITransformer<TRequestTransformerInput<Q>, Requests.TApiRequestConfig>>;

    /**
     * The URL to send requests to.
     * You can override this for each request by overriding the requestTransformer.
     */
    public readonly abstract url?: string;

    /**
     * Deletes an entity.
     * 
     * @param {TModelIdentifier} id 
     * @returns {Promise<void>}
     */
    public async delete(id: Models.TModelIdentifier): Promise<void> {
        const requestConfig = await (await this.makeRequestTransformer()).transform({
            method: 'DELETE',
            query: { id },
            url: this.url,
        } as TRequestTransformerInput<Q>);

        try {
            await (await this.makeRequest()).send(requestConfig);
        } catch (e) {
            throw new ResourceException('Failed to delete resource', e);
        }
    }

    /**
     * Fetches a single entity by its identitifer.
     * 
     * @param {TModelIdentifier} id 
     * @returns {Promise<null | T>}
     */
    public async get(id: Models.TModelIdentifier): Promise<null | T> {
        const requestConfig = await (await this.makeRequestTransformer()).transform({
            method: 'GET',
            query: { id },
            url: this.url,
        } as TRequestTransformerInput<Q>);

        try {
            const response = await (await this.makeRequest()).send(requestConfig);

            if (!response?.data) {
                return null;
            }

            return (await this.makeModelTransformer()).transform(response.data);
        } catch (e) {
            throw new ResourceException('Failed to get resource', e);
        }
    }

    /**
     * Fetches multiple entities that match the given query.
     * TODO: This should return a collection instance
     * 
     * @param {Q} query 
     * @returns {Promise<null[] | T[]}
     */
    public async query(query: Q): Promise<null[] | T[]> {
        const config = await (await this.makeRequestTransformer()).transform({
            method: 'GET',
            query,
            url: this.url,
        });

        try {
            const response = await (await this.makeRequest()).send<Object[]>(config);

            if (!response?.data || !response?.data?.length) {
                return [];
            }

            return Promise.all(
                response.data.map(async (item: any) => (await this.makeModelTransformer(query)).transform(item)),
            );
        } catch (e) {
            console.log('Query error', { ...e });
            throw new ResourceException('Failed to query resource', e);
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

        const requestConfig = await (await this.makeRequestTransformer()).transform({
            body: entity.serialize(),
            // TODO: figure out how to type properties available on model instance
            method: entity.id ? 'PUT' : 'POST',
            query: { id },
            url: this.url,
        } as TRequestTransformerInput<Q>);

        try {
            const response = await (await this.makeRequest()).send(requestConfig);
            return (await this.makeModelTransformer()).transform(response.data);
        } catch (e) {
            throw new ResourceException('Failed to save resource', e);
        }
    }
}
