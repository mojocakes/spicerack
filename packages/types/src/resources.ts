import { Data } from './data';
import { Generic } from './generic';
import { Models } from './models';

export namespace Resources {
    export interface IStreamableResource<
        T extends Models.IModel<any>,
        Q extends Record<string, any> = {},
    > extends Data.IRepository<T, Q> {
        /**
         * Streams all entities found for the given query.
         * 
         * @param {Q} query
         * @returns {AsyncIterable<T>}
         * 
         * @example
         * for await (let entity of resource.stream(query)) {
         *     console.log(entity);
         * }
         */
        stream(query: Q): AsyncIterable<T>;
    }

    export interface IRateLimiter extends Generic.IService {
        readonly config: IRateLimitConfig;
        readonly status: IRateLimitStatus;

        /**
         * Delays any subsequent requests until an amount of time has elapsed
         *
         * @param {number} length delay in milliseconds
         */
        delay(length: number): void;

        /**
         * Resolves when the next request can be made.
         */
        queue<T>(callback: () => Promise<T>): Promise<T>;
    }

    export enum IRateLimitStatus {
        OPEN = 'OPEN',
        THROTTLED = 'THROTTLED',
    };

    export type IRateLimitConfig = {
        period: number; // milliseconds
        max: number;
    };
}
