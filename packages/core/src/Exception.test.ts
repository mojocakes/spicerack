import { Exception } from './Exception';

class TestError extends Exception {}

describe('core/Exception', () => {
    it('generates a stack trace', () => {
        const e = new TestError();
        expect(typeof e.stack).toEqual('string');
        expect(e.stack?.length).toBeGreaterThan(0);
    });

    it('can include contextual data', () => {
        const data = {
            id: 14,
            code: 'UNKNOWN_STATUS',
        };
        const e = new TestError(data);
        expect(e.context).toEqual(data);
    });

    it('can include a message', () => {
        const message = 'Mock error message';
        const e = new TestError(null, message);
        expect(e.message).toEqual(message);
        expect(e.toString()).toEqual(`Error: ${message}`);
    });

    it('can be extended and type checked using "instanceof"', () => {
        const e = new TestError();
        expect(e instanceof TestError).toBeTruthy();
    });
});
