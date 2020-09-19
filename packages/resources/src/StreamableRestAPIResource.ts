import { Models, Requests, Resources, Transformers } from '@spicerack/types';
import { RestAPIResource } from './RestAPIResource';

export abstract class StreamableRestAPIResource<
    /**
     * The model type
     * 
     * TODO: Fix this type to specify optional "id" property of model
     */
    T extends Models.IModel<any & Models.TDefaultModelProperties>,
    /**
     * Available query parameters
     */
    Q extends Requests.TBaseModelQuery = Requests.TBaseModelQuery,
> extends RestAPIResource<T, Q> implements Resources.IStreamableResource<T, Q> {
    /**
     * Transformer that prepares a query object to get the next page of results.
     * 
     * The "transform" method should prepare the next page query.
     * The "untransform" method should prepare the previous page query.
     */
    protected abstract paginatedQueryTransformer: Transformers.ITransformer<Q, Q>;

    /**
     * Streams all entities found for the given query.
     * 
     * @param {Q} query 
     * @param {Partial<C>} requestConfig
     * @returns {AsyncIterable<T>}
     * 
     * @example
     * for await (let entity of resource.stream(query)) {
     *     console.log(entity);
     * }
     */
    public async *stream(query: Q): AsyncIterableIterator<T> {
        const self = this;
        const queries: Q[] = [
            // This ensures the query defaults are set to request the initial page of data
            self.paginatedQueryTransformer.untransform(
                self.paginatedQueryTransformer.transform(query)
            ),
        ];
        // helper fn that returns the last item in an array
        const getLastItem = (arr: any[]) => arr[arr.length - 1];

        // yields an array of pages
        async function *yieldPages(): AsyncIterable<T[]> {
            let hasNextPage: boolean = true;

            while (hasNextPage) {
                try {
                    // Make the request
                    const items = await self.query(getLastItem(queries));

                    // Prepare the next query
                    queries.push(self.paginatedQueryTransformer.transform(getLastItem(queries)));

                    // Stop the loop if no items were returned
                    if (!items || !items.length) {
                        hasNextPage = false;
                    }

                    yield items as T[];
                } catch {
                    hasNextPage = false;
                }
            }
        }

        // yields an array of items
        for await (let results of yieldPages()) {
            yield* results;
        }
    }
}
