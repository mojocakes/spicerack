import { Exception } from './Exception';

// -- Mocks
const MOCK_MESSAGE = 'MOCK_MESSAGE';

// -- Testables
class TestError extends Exception {}

describe('core/Exception', () => {
    it('generates a stack trace', () => {
        const e = new TestError(MOCK_MESSAGE);
        expect(typeof e.stack).toEqual('string');
        expect(e.stack?.length).toBeGreaterThan(0);
    });

    it('can include a message', () => {
        const e = new TestError(MOCK_MESSAGE);
        expect(e.message).toEqual(MOCK_MESSAGE);
        expect(e.toString()).toEqual(`Error: ${MOCK_MESSAGE}`);
    });

    it('can include contextual data', () => {
        const data = {
            id: 14,
            code: 'UNKNOWN_STATUS',
        };
        const e = new TestError(MOCK_MESSAGE, data);
        expect(e.context).toEqual(data);
    });

    it('can be extended and type checked using "instanceof"', () => {
        const e = new TestError(MOCK_MESSAGE);
        expect(e instanceof TestError).toBeTruthy();
    });
});
