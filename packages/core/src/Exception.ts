export abstract class Exception extends Error {
    constructor(
        /**
         * A short message describing the error.
         * What you'd usually provide as the only argument to new Error().
         * 
         * @var {string}
         */
        public message: string,
        /**
         * Provide any contextual data that would be helpful to understand what happened.
         * Passing a previously thrown error is acceptable.
         * 
         * @var {null | Record<string, any> = undefined}
         */
        public context?: null | Record<string, any>,
    ) {
        super(message);

        // Fixes the prototype of this class
        const truePrototype = new.target.prototype;
        Object.setPrototypeOf(this, truePrototype);

        this.handle = this.handle.bind(this);
        this.handle();
    }

    protected handle(): void {
        //
    }
}
