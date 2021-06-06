import { Models, Requests, Resources, Transformers } from '@/types';
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
    protected abstract makePaginatedQueryTransformer(originalQuery?: Q): Promise<Transformers.ITransformer<Q, Q>>;

    /**
     * The rate limiter that will be used to throttle requests.
     */
    protected abstract makeRateLimiter(): Promise<Resources.IRateLimiter>;

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
        await this.ready;
        const self = this;
        const queryTransformer = await this.makePaginatedQueryTransformer(query);
        const queries: Q[] = [
            // This ensures the query defaults are set to request the initial page of data
            await queryTransformer.untransform(
                await queryTransformer.transform(query),
            ),
        ];
        // helper fn that returns the last item in an array
        const getLastItem = (arr: any[]) => arr[arr.length - 1];

        // yields an array of pages
        async function *yieldPages(): AsyncIterable<T[]> {
            let shouldContinue = true;

            while (shouldContinue) {
                try {
                    // Make the request
                    // const items = await self.query(getLastItem(queries));

                    const items = await (await self.makeRateLimiter()).queue(() => self.query(getLastItem(queries)));

                    // Prepare the next query
                    queries.push(await queryTransformer.transform(getLastItem(queries)));

                    // Stop the loop if we're done
                    shouldContinue =  await self.shouldMakeNextQuery(query, getLastItem(queries), getLastItem(queries), items);

                    yield items as T[];
                } catch {
                    shouldContinue = false;
                }
            }
        }

        // yields an array of items
        for await (let results of yieldPages()) {
            yield* results;
        }
    }

    /**
     * Determines whether the next set of data should be requested.
     * If false is returned, no more requests will be made.
     *
     * @param {Q} originalQuery
     * @param {Q} previousQuery
     * @param {Q} nextQuery
     * @param {null[] | T[]} previousData
     * @returns
     */
    protected async shouldMakeNextQuery(
        originalQuery: Q,
        previousQuery: Q,
        nextQuery: Q,
        previousData: null[] | T[],
    ): Promise<boolean> {
        return !!previousData.length;
    }
}
