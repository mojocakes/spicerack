import { RestAPIResource, DefaultRequestTransformer } from './RestAPIResource';
import { Models, Requests, Transformers } from '@/types';

// -- Mocks
// mock model
type TInventor = {
    id?: number;
    name: string;
};

type TQuery = {
    id?: null | number;
    name?: string;
};

class InventorModel implements Models.IModel<TInventor> {
    constructor(public data: any) {}
    id = this.data.id;
    set = jest.fn();
    save = jest.fn();
    serialize = jest.fn();
}

// mock requests
const mockRequest__isSuccessful: Requests.IRequest = {
    ready: Promise.resolve(),
    send: jest.fn((config: Requests.TApiRequestConfig): Promise<Requests.TRequestResponse> => {
        const inventors: TInventor[] = [
            {
                id: 1,
                name: 'Nikola Tesla',
            },
            {
                id: 2,
                name: 'Thomas Edison',
            },
        ];

        if (config?.params?.id) {
            return Promise.resolve<any>({
                config,
                data: inventors[0],
            });
        }

        return Promise.resolve({
            config,
            data: inventors,
        });
    }),
}
const mockRequest__fails: Requests.IRequest = {
    ready: Promise.resolve(),
    send: jest.fn(() => Promise.reject('This mock request class throws an error.')),
}
const mockRequest__sendsNoData: Requests.IRequest = {
    ready: Promise.resolve(),
    send: jest.fn((config: Requests.TApiRequestConfig): Promise<Requests.TRequestResponse<any>> => {
        if (config?.params?.id) {
            return Promise.resolve({
                config,
                data: null,
            });
        }

        return Promise.resolve({
            config,
            data: [],
        });
    }),
}

// mock transformers
const mockModelTransformer: Transformers.ITransformer<Requests.TApiResult<any>, InventorModel> = {
    ready: Promise.resolve(),
    transform: jest.fn(async (data: any) => new InventorModel(data)),
    untransform: jest.fn(async (model: InventorModel) => model.serialize()),
}

// -- Testables
// standard resource for basic tests
class Resource extends RestAPIResource<InventorModel, TQuery> {
    ready = Promise.resolve();
    makeRequest = async () => mockRequest__isSuccessful;
    makeModelTransformer = async () => mockModelTransformer;
    makeRequestTransformer = async () => new DefaultRequestTransformer();
    url = 'http://localhost/api/v1';
}

// resource whose requests will fail
class ResourceWithFailingRequest extends Resource {
    makeRequest = async () => mockRequest__fails;
}

// resource whose requests return no data
class ResourceWithNoData extends Resource {
    makeRequest = async () => mockRequest__sendsNoData;
}

const resource = new Resource();
const resourceWithFailingRequest = new ResourceWithFailingRequest();
const resourceWithNoData = new ResourceWithNoData();

describe('resources/RestAPIResource', () => {
    describe('delete()', () => {
        it('makes a DELETE request', async () => {
            await resource.delete(1);
            const requestArgument = (mockRequest__isSuccessful.send as jest.Mock).mock.calls[0][0];
            expect(requestArgument.method).toEqual('DELETE');
        });

        describe('IF request is successful', () => {
            it('returns a promise that resolves to void', async () => {
                const result = resource.delete(1);
                expect(result instanceof Promise).toBeTruthy();
                expect(await result).toBeFalsy();
            });
        });

        describe('IF request is NOT successful', () => {
            it('throws an exception', async () => {
                expect.assertions(1);
    
                try {
                    await resourceWithFailingRequest.delete(5);
                } catch (e) {
                    expect(e instanceof Error).toBeTruthy();
                }
            });
        });
    });
    
    describe('get()', () => {
        it('makes a GET request', async () => {
            await resource.get(2);
            const requestArgument = (mockRequest__isSuccessful.send as jest.Mock).mock.calls[0][0];
            expect(requestArgument.method).toEqual('GET');
        });

        describe('IF request is successful', () => {
            it('returns a promise that resolves to a model', async () => {
                const result = await resource.get(2);
                expect(result).toBeTruthy();
                expect(result instanceof InventorModel).toBeTruthy();
            });
        });

        describe('IF request returns no data', () => {
            it('returns a promise that resolves to null', async () => {
                const response = await resourceWithNoData.get(9);
                expect(response).toBe(null);
            });
        });

        describe('IF request is NOT successful', () => {
            it('throws an exception', async () => {
                expect.assertions(1);
                
                try {
                    await resourceWithFailingRequest.get(2);
                } catch (e) {
                    expect(e instanceof Error).toBeTruthy();
                }
            });
        });
    });
    
    describe('query()', () => {
        it('makes a GET request', async () => {
            await resource.query({ id: 3 });
            const requestArgument = (mockRequest__isSuccessful.send as jest.Mock).mock.calls[0][0];
            expect(requestArgument.method).toEqual('GET');
        });

        describe('IF request is successful', () => {
            it('returns a promise that resolves to an array of models', async () => {
                const result = await resource.query({ name: 'John' });
                expect(Array.isArray(result)).toBeTruthy();
                expect(result[0] instanceof InventorModel).toBeTruthy();
            });
        });

        describe('IF request returns no data', () => {
            it('returns a promise that resolves to []', async () => {
                const response = await resourceWithNoData.query({ name: 'John' });
                expect(response).toEqual([]);
            });
        });

        describe('IF request is NOT successful', () => {
            it('throws an exception', async () => {
                expect.assertions(1);
                
                try {
                    await resourceWithFailingRequest.query({ name: 'John' });
                } catch (e) {
                    expect(e instanceof Error).toBeTruthy();
                }
            });
        });
    });
    
    describe('save()', () => {
        it('makes a POST request if the entity has no id', async () => {
            const inventor = new InventorModel({ id: null, name: 'Satoshi Nakamoto' });
            await resource.save(inventor);

            const requestArgument = (mockRequest__isSuccessful.send as jest.Mock).mock.calls[0][0];
            expect(requestArgument.method).toEqual('POST');
        });

        it('makes a PUT request if the entity has an id', async () => {
            const inventor = new InventorModel({ id: 10, name: 'Leonardo Da Vinci' });
            await resource.save(inventor);

            const requestArgument = (mockRequest__isSuccessful.send as jest.Mock).mock.calls[0][0];
            expect(requestArgument.method).toEqual('PUT');
        });

        describe('IF request is successful', () => {
            it('returns a promise that resolves to a model', async () => {
                const inventor = new InventorModel({ id: 10, name: 'Leonardo Da Vinci' });
                const response = await resource.save(inventor);
                expect(response instanceof InventorModel).toBeTruthy();
            });
        });

        describe('IF request is NOT successful', () => {
            it('throws an exception', async () => {
                expect.assertions(1);
                
                try {
                    const inventor = new InventorModel({ id: 10, name: 'Leonardo Da Vinci' });
                    await resourceWithFailingRequest.save(inventor);
                } catch (e) {
                    expect(e instanceof Error).toBeTruthy();
                }
            });
        });
    });
});
