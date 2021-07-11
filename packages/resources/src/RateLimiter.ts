import { Service } from '@/core';
import { Resources } from '@/types';

export class RateLimiter extends Service implements Resources.IRateLimiter {
    public readonly config: Resources.IRateLimitConfig;
    protected delayedUntil: null | number = null;
    public readonly ready = Promise.resolve();
    public readonly status: Resources.IRateLimitStatus = Resources.IRateLimitStatus.OPEN;


    /**
     * An array containing the timestamps of recent requests.
     *
     * @type {number[]}
     */
    protected requestTimes: number[] = [];

    public constructor(config: Resources.IRateLimitConfig) {
        super();
        this.config = config;
    }

    /**
     * Delays any subsequent requests until an amount of time has elapsed
     *
     * @param {number} length delay in milliseconds
     */
    public delay(length: number): void {
        this.delayedUntil = (this.delayedUntil || +new Date()) + length;
    }

    /**
     * Resolves when the next request can be made.
     */
    public queue<T = any>(callback: () => Promise<T>): Promise<T> {
        return new Promise(async (resolve) => {
            const check = async () => {
                if (this.canMakeRequest()) {
                    this.requestTimes.push(new Date().valueOf());
                    resolve(await callback());
                } else {
                    const nextOpportunity = this.nextOpportunity();
                    const timeout = nextOpportunity - (new Date().valueOf());
                    console.info(`RateLimiter: waiting for ${timeout / 1000} seconds`);
                    await new Promise(r => setTimeout(r, timeout));
                    check();
                }
            };

            await check();
        });
    }

    /**
     * Checks whether a request can be made immediately.
     *
     * @returns {boolean}
     */
    protected canMakeRequest(): boolean {
        const now = new Date().valueOf();

        // check if a delay is in progress
        if ((this.delayedUntil || 0) > now) {
            return false;
        }

        // filter this.requestTimes to only contain requests made in the current window
        const windowStartTime = now - this.config.period;
        this.requestTimes = this.requestTimes.filter(time => {
            return time > windowStartTime;
        });

        const maxRequestsHit = this.requestTimes.length >= this.config.max;
        return !maxRequestsHit;
    }

    /**
     * Gets the earliest possible timestamp when a next request could be made.
     *
     * This is either the start of the next "window" or the end of a delay,
     * if one is in progress.
     *
     * NOTE: call this.canMakeRequest() first to determine whether a request can be made immediately.
     *
     * @returns {number}
     */
    protected nextOpportunity(): number {
        return Math.max(
            (this.delayedUntil || 0),
            (this.requestTimes[0] || (new Date().valueOf())) + this.config.period,
        );
    }
}
