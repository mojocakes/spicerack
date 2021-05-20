import { Generic } from '@/types';

export namespace Transformers {
    export interface ITransformer<A, B> extends Generic.IService {
        /**
         * Transforms A to B.
         * 
         * @param {A} input
         * @returns {B}
         */
        transform(input: A): Promise<B>;
    
        /**
         * Transforms B to A.
         * 
         * @param {B} input
         * @returns {A}
         */
        untransform(input: B): Promise<A>;
    }
}
