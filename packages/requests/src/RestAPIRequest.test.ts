import * as Types from '@spicerack/types';
import { RestAPIRequest } from './RestAPIRequest';

// -- mocks
const MOCK_DATA = Symbol('MOCK_DATA');
const mockAxios = jest.fn(async (): Promise<Types.Requests.TApiResponse<any>> => ({
    data: MOCK_DATA,
}));

// -- testables
class Request extends RestAPIRequest {
    axios = mockAxios as any;
}
const request = new Request();

describe('requests/RestAPIRequest', () => {
    describe('send()', () => {
        it('makes an API request', () => {
            const requestConfig: Types.Requests.TApiRequestConfig = {
                url: 'http://MOCK_DOMAIN.com/api/v1/statistics',
                method: 'GET',
            }

            request.send(requestConfig);
            expect(mockAxios).toHaveBeenCalledWith(requestConfig);
        });

        it('returns a promise that resolves to an ApiResult object', async () => {
            const requestConfig: Types.Requests.TApiRequestConfig = {
                url: 'http://MOCK_DOMAIN.com/api/v1/statistics',
                method: 'GET',
            }

            const result = await request.send(requestConfig);

            expect(result.config).toEqual(requestConfig);
            expect(result.data).toEqual(MOCK_DATA);
        });
    });
});
