import * as Types from '@spicerack/types';
import { RestAPIRequest } from './RestAPIRequest';

// -- mocks
const mockAxios = jest.fn(async (): Promise<Types.Requests.TApiResponse<any>> => ({
    data: {},
}));

// -- testables
const request = new RestAPIRequest(mockAxios as any);

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

            expect(result.requestConfig).toEqual(requestConfig);
            expect(result).toHaveProperty('response');
            expect(result.response).toHaveProperty('data');
        });
    });
});
