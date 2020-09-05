import { EnvConfig } from './EnvConfig';

// -- mocks
type T = Partial<{
    TEST_VALUE_ONE: string,
    TEST_VALUE_TWO: number,
    NEW_KEY: string,
}>;

const mockEnv = {
    TEST_VALUE_ONE: 'HELLO_WORLD',
    TEST_VALUE_TWO: 12345,
}

// -- testables
const envConfig = new EnvConfig<T>({ ...process.env, ...mockEnv });

beforeAll(async () => {
    await envConfig.ready;
});

describe('config/EnvConfig', () => {
    it('loads initial values from .env file', async () => {
        const config = await envConfig.all();
        expect(config.TEST_VALUE_ONE).toEqual('HELLO_WORLD');
        expect(config.TEST_VALUE_TWO).toEqual(12345);
    });

    describe('get()', () => {
        it('returns null if the value cannot be found.', async () => {
            expect(await envConfig.get('INVALID_KEY' as any)).toEqual(null);
        });

        it('returns the expected value', async () => {
            expect(await envConfig.get('TEST_VALUE_ONE')).toEqual('HELLO_WORLD');
            expect(await envConfig.get('TEST_VALUE_TWO')).toEqual(12345);
        });
    });

    describe('set()', () => {
        it('stores the provided value', async () => {
            const key = 'NEW_KEY';
            const value = 'NEW_VALUE';

            await envConfig.set(key, value);
            expect(await envConfig.get(key)).toEqual(value);
        });

        it('overwrites any existing value', async () => {
            const key = 'TEST_VALUE_ONE';
            const value = 'OVERRIDDEN_VALUE';
            
            await envConfig.set(key, value);
            expect(await envConfig.get(key)).toEqual(value);
        });
    });
});
