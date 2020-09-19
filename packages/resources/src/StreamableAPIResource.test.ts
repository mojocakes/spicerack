import * as Types from '@spicerack/types';
import { StreamableRestAPIResource } from './StreamableRestAPIResource';

// -- Mocks
type TVehicle = {
    id?: null | number;
    brand: string;
    model: string;
}

type TQuery = {
    id?: number;
    brand?: string;
    page?: number;
    perPage?: number;
}

class VehicleModel implements Types.Models.IModel<TVehicle> {
    constructor(public data: TVehicle) {}
    save = jest.fn();
    serialize = jest.fn(() => this.data);
    set = jest.fn();
}

const mockModelTransformer: Types.Transformers.ITransformer<any, VehicleModel> = {
    transform: (data: TVehicle) => {
        return new VehicleModel(data);
    },
    untransform: (model: VehicleModel) => model.serialize(),
};

const mockPaginatedQueryTransformer: Types.Transformers.ITransformer<TQuery, TQuery> = {
    transform: jest.fn((query: TQuery): TQuery => {
        // defaults
        const defaults = {
            page: 0,
            perPage: 5,
        }
        const page = (query.page || defaults.page) + 1;
        const perPage = query.perPage || defaults.perPage;

        return {
            ...query,
            page,
            perPage,
        };
    }),

    untransform(query: TQuery): TQuery {
        // defaults
        const defaults = {
            page: 1,
            perPage: 5,
        }
        const page = Math.max(1, (query.page || defaults.page) - 1);
        const perPage = query.perPage || defaults.perPage;

        return {
            ...query,
            page,
            perPage,
        };
    },
};

const vehicles: TVehicle[] = [
    { id: 1, brand: 'Tesla', model: 'S' },
    { id: 2, brand: 'Tesla', model: '3' },
    { id: 3, brand: 'Tesla', model: 'X' },
    { id: 4, brand: 'Tesla', model: 'Y' },
    { id: 5, brand: 'Tesla', model: 'Cybertruck' },
    { id: 6, brand: 'Tesla', model: 'Roadster' },
    { id: 7, brand: 'Tesla', model: 'Semi' },
    { id: 8, brand: 'Tesla', model: 'ATV' },
    { id: 9, brand: 'Nissan', model: 'Leaf' },
    { id: 10, brand: 'Volkswagen', model: 'ID.3' },
    { id: 11, brand: 'Volkswagen', model: 'e-up' },
    { id: 12, brand: 'Porsche', model: 'Taycan' },
];

const mockRequest: Types.Requests.IRequest = {
    send: jest.fn(async (config: Types.Requests.TApiRequestConfig): Promise<Types.Requests.TRequestResponse<any>> => {
        const defaults = {
            page: 1,
            per_page: 5,
        };

        const start = ((config?.params?.page || defaults.page) - 1) * (config?.params?.per_page || defaults.per_page);
        const end = start + (config?.params?.per_page || defaults.per_page);
        const data: TVehicle[] = vehicles.slice(start, end);

        return {
            config,
            data,
        };
    }),
};

// -- Testables
class Resource extends StreamableRestAPIResource<VehicleModel, TQuery> {
    modelTransformer = mockModelTransformer;
    paginatedQueryTransformer = mockPaginatedQueryTransformer;
    request = mockRequest;
    url = 'http://localhost/api/v1/vehicles';
}

const resource = new Resource();

describe('resources/StreamableRestAPIResource', () => {
    describe('stream()', () => {
        it('should return an async iterable', async () => {
            const stream = resource.stream({ brand: 'Tesla' });
            expect(stream).toHaveProperty('next');
            expect(stream).toHaveProperty('return');
            expect(stream.next() instanceof Promise).toBeTruthy();
        });

        it('should iterate over each item in the page of results', async () => {
            expect.assertions(5);

            const stream = resource.stream({ brand: 'Tesla' });
            expect((await stream.next()).value).toBeInstanceOf(VehicleModel)
            expect((await stream.next()).value).toBeInstanceOf(VehicleModel);
            expect((await stream.next()).value).toBeInstanceOf(VehicleModel);
            expect((await stream.next()).value).toBeInstanceOf(VehicleModel);
            expect((await stream.next()).value).toBeInstanceOf(VehicleModel);
        });

        it('should make a GET request', async () => {
            await resource.stream({ brand: 'Tesla' }).next();
            expect(mockRequest.send).toHaveBeenCalled();
        });

        it('should request the next page of data after reaching the end of the results', async () => {
            expect.assertions(13);

            let i = 0;
            for await (let value of resource.stream({})) {
                expect(value.data).toEqual(vehicles[i]);
                i++;
            }

            // We expect 4 requests because the third request will only contain 2 results,
            // and we have no way of knowing whether that is less than the expected number
            // without requiring the consumer to implement another method.
            // Making requests until there are no more results is just a better DX 🤷‍♂️
            expect(mockRequest.send).toHaveBeenCalledTimes(4);
        });
    });
});
