import { RateLimiter } from './RateLimiter';

const tenMins = 600000;

beforeEach(() => {
    jest.useFakeTimers('modern');
});
describe('resources/RateLimiter', () => {
    describe('queue()', () => {
        it('should throttle requests', async () => {
            const limit = new RateLimiter({
                period: tenMins,
                max: 10,
            });
            const makeRequest = jest.fn((id: string) => Promise.resolve());
            // make 22 requests...
            limit.queue(() => makeRequest('request #1'));
            limit.queue(() => makeRequest('request #2'));
            limit.queue(() => makeRequest('request #3'));
            limit.queue(() => makeRequest('request #4'));
            limit.queue(() => makeRequest('request #5'));
            limit.queue(() => makeRequest('request #6'));
            limit.queue(() => makeRequest('request #7'));
            limit.queue(() => makeRequest('request #8'));
            limit.queue(() => makeRequest('request #9'));
            limit.queue(() => makeRequest('request #10'));
            limit.queue(() => makeRequest('request #11'));
            limit.queue(() => makeRequest('request #12'));
            limit.queue(() => makeRequest('request #13'));
            limit.queue(() => makeRequest('request #14'));
            limit.queue(() => makeRequest('request #15'));
            limit.queue(() => makeRequest('request #16'));
            limit.queue(() => makeRequest('request #17'));
            limit.queue(() => makeRequest('request #18'));
            limit.queue(() => makeRequest('request #19'));
            limit.queue(() => makeRequest('request #20'));
            limit.queue(() => makeRequest('request #21'));
            limit.queue(() => makeRequest('request #22'));

            // only expect 10 to be made immediately
            expect(makeRequest).toHaveBeenCalledTimes(10);

            // go forward 10 mins
            jest.setSystemTime(+new Date() + tenMins);
            jest.advanceTimersByTime(tenMins);
            await Promise.resolve();

            // expect another 10 requests to be made
            expect(makeRequest).toHaveBeenCalledTimes(20);

            // go forward 10 mins
            jest.setSystemTime(+new Date() + tenMins);
            jest.advanceTimersByTime(tenMins);
            await Promise.resolve();

            // expect another 2 requests to be made
            expect(makeRequest).toHaveBeenCalledTimes(22);
        });
    
        it('should NOT throttle requests if disabled', () => {
            const limit = new RateLimiter({
                period: 0,
                max: Infinity,
            });
            const makeRequest = jest.fn(() => Promise.resolve());
            // make 12 requests...
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            limit.queue(() => makeRequest());
            // only expect 12 to have been made...
            expect(makeRequest).toHaveBeenCalledTimes(12);
        });
    });

    describe('delay()', () => {
        it('should delay subsequent requests', async () => {
            const limit = new RateLimiter({
                period: 0,
                max: Infinity,
            });
            const makeRequest = jest.fn((id: string) => Promise.resolve());
            limit.queue(() => makeRequest('Delay request #1'));
            limit.queue(() => makeRequest('Delay request #2'));
            limit.delay(tenMins);
            limit.queue(() => makeRequest('Delay request #3'));
            limit.queue(() => makeRequest('Delay request #4'));
            limit.queue(() => makeRequest('Delay request #5'));
            limit.queue(() => makeRequest('Delay request #6'));
            limit.queue(() => makeRequest('Delay request #7'));
            limit.queue(() => makeRequest('Delay request #8'));
            limit.queue(() => makeRequest('Delay request #9'));
            limit.queue(() => makeRequest('Delay request #10'));
            limit.queue(() => makeRequest('Delay request #11'));
            limit.queue(() => makeRequest('Delay request #12'));

            expect(makeRequest).toHaveBeenCalledTimes(2);

            // go forward 9 mins
            jest.setSystemTime(+new Date() + (tenMins - 1000));
            // jest.runAllTimers();
            jest.advanceTimersByTime(tenMins - 1000);
            await Promise.resolve();

            expect(makeRequest).toHaveBeenCalledTimes(2);

            // go forward 1 minute
            jest.setSystemTime(+new Date() + 1000);
            jest.advanceTimersByTime(1000);
            await Promise.resolve();

            expect(makeRequest).toHaveBeenCalledTimes(12);
        });
    });
});
