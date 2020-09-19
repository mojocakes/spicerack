// import deepmerge from 'deepmerge';
import '@spicerack/requests';
import { container } from '@spicerack/inject';
import { ResourceException, ResourceTransformerException } from './exceptions';
import { Models, Requests, Resources, Transformers } from '@spicerack/types';

type TRequestTransformerInput<Q> = {
    query: Q,
} & Partial<Requests.TApiRequestConfig>;

class DefaultRequestTransformer implements Transformers.ITransformer<TRequestTransformerInput<any>, Requests.TApiRequestConfig> {
    transform(config: TRequestTransformerInput<any>): Requests.TApiRequestConfig {
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

    untransform(): any {
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
> implements Resources.IResource<T, Q> {
    /**
     * Transforms raw response data into models.
     */
    protected abstract modelTransformer: Transformers.ITransformer<any, T>;

    /**
     * Service used to make API requests.
     */
    protected request: Requests.IRequest<Requests.TApiRequestConfig, null | T> = container.get('services.requests.restApiRequest');

    /**
     * Transforms resource queries into request queries.
     * Takes an array of objects that contain the query, and any other stuff it needs.
     */
    protected requestTransformer: Transformers.ITransformer<TRequestTransformerInput<Q>, Requests.TApiRequestConfig> = new DefaultRequestTransformer();

    /**
     * The URL to send requests to.
     * You can override this for each request by overriding the requestTransformer.
     */
    protected url?: string;

    /**
     * Deletes an entity.
     * 
     * @param {TModelIdentifier} id 
     * @returns {Promise<void>}
     */
    public async delete(id: Models.TModelIdentifier): Promise<void> {
        const requestConfig = this.requestTransformer.transform({
            method: 'DELETE',
            query: { id },
            url: this.url,
        } as TRequestTransformerInput<Q>);

        try {
            await this.request.send(requestConfig);
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
        const requestConfig = this.requestTransformer.transform({
            method: 'GET',
            query: { id },
            url: this.url,
        } as TRequestTransformerInput<Q>);

        try {
            const response = await this.request.send(requestConfig);

            if (!response?.data) {
                return null;
            }

            return this.modelTransformer.transform(response.data);
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
        const config = this.requestTransformer.transform({
            method: 'GET',
            query,
            url: this.url,
        });

        try {
            const response = await this.request.send<Object[]>(config);

            if (!response?.data || !response?.data?.length) {
                return [];
            }

            return response.data.map((item: any) => this.modelTransformer.transform(item));
        } catch (e) {
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

        const requestConfig = this.requestTransformer.transform({
            body: entity.serialize(),
            // TODO: figure out how to type properties available on model instance
            method: entity.data.id ? 'PUT' : 'POST',
            query: { id },
            url: this.url,
        } as TRequestTransformerInput<Q>);

        try {
            const response = await this.request.send(requestConfig);
            return this.modelTransformer.transform(response.data);
        } catch (e) {
            throw new ResourceException('Failed to save resource', e);
        }
    }
}
