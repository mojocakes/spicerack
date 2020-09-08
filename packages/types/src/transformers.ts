export namespace Transformers {
    export interface ITransformer<A, B> {
        /**
         * Transforms A to B.
         * 
         * @param {A} input
         * @returns {B}
         */
        transform(input: A): B;
    
        /**
         * Transforms B to A.
         * 
         * @param {B} input
         * @returns {A}
         */
        untransform(input: B): A;
    }
}
