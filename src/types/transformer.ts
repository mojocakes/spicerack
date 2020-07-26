export interface ITransformer<A, B> {
    transform(input: A): B;

    untransform(input: B): A;
}
