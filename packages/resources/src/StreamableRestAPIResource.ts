import { decorate, injectable } from '@spicerack/core';
import { RestAPIResource } from './RestAPIResource';
import { TApiRequestConfig } from '@spicerack/core/src/types/requests';
import { IModel } from '@spicerack/core/src/interfaces/models';
import { TDefaultModelProperties } from '@spicerack/core/src/types/models';
import { IStreamableResource } from '@spicerack/core/src/interfaces/resources';

export abstract class StreamableRestAPIResource<
    /**
     * The model type
     * 
     * TODO: Fix this type to specify optional "id" property of model
     */
    T extends IModel<any & TDefaultModelProperties>,
    /**
     * Available query parameters
     */
    Q extends Object = {},
    /**
     * Available config parameters
     */
    C extends TApiRequestConfig = TApiRequestConfig,
> extends RestAPIResource<T, Q, C> implements IStreamableResource<T, Q, C> {
    /**
     * Streams all entities found for the given query.
     * 
     * @param {Q=} query 
     * @param {Partial<C>} requestConfig
     * @returns {AsyncIterable<T>}
     * 
     * @example
     * for await (let entity of resource.stream(query)) {
     *     console.log(entity);
     * }
     */
    public async *stream(query?: Q, requestConfig?: Partial<C>): AsyncIterable<T> {
        const self = this;

        function getNextParams(params: C['params'] = {}): C['params'] {
            return {
                per_page: 5,
                ...params,
                page: Math.max(1, params.page || 0) + 1,
            };
        }

        async function *yieldPages(): AsyncIterable<T[]> {
            let hasNextPage: boolean = true;
            let params: C['params'] = getNextParams({
                ...query,
            });

            const configHistory: any[] = [{ requestConfig, query }, undefined];

            while (hasNextPage) {
                try {
                    const config = await self.makeRequestConfig(configHistory[0], configHistory[1]);
                    // prepare the next two arguments to "makeRequestConfig"
                    configHistory.unshift(config);
                    configHistory.length = 2;
                    
                    const response = await self.request.send(config);
                    params = getNextParams(params);
                    yield self.responseTransformer.transform(response);
                } catch {
                    hasNextPage = false;
                }
                
                // if (!self.hasNextPage(response)) {
                //     hasNextPage = false;
                // }
            }
        }

        for await (let results of yieldPages()) {
            yield* results;
        }
    }

    // protected abstract hasNextPage(response: TPaginatedApiResponse<T[]>): boolean {
    //     const previousItemCount = (response.page - 1) * response.per_page;
    //     const pageCount = response.data.length;
    //     const total = previousItemCount + pageCount;
    //     return total < response.total;
    // }
}

decorate(injectable(), StreamableRestAPIResource);
