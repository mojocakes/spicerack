import { EventNotifier } from './EventNotifier';

 type TEventTypes = {
     'STARTED': { dateTime: number };
     'STOPPED': { reason: string };
 }
 const mockData = {
     STARTED: { dateTime: 12345 },
     STOPPED: { reason: 'Because it was about to blow up' },
 };

 describe('services/tools/EventNotifier', () => {
     it('should allow subscribing to all event types', () => {
         const events = new EventNotifier<TEventTypes>();
         const callback = jest.fn();
         events.subscribe(callback);

         events.broadcast('STARTED', mockData['STARTED']);
         expect(callback).toHaveBeenCalledWith(mockData['STARTED'], 'STARTED');

         events.broadcast('STOPPED', mockData['STOPPED']);
         expect(callback).toHaveBeenCalledWith(mockData['STOPPED'], 'STOPPED');
     });

     it('should allow subscribing to specific events only', () => {
         const events = new EventNotifier<TEventTypes>();
         const callback = jest.fn();
         events.subscribe(callback, ['STOPPED']);

         events.broadcast('STARTED', mockData['STARTED']);
         expect(callback).not.toHaveBeenCalledWith(mockData['STARTED'], 'STARTED');

         events.broadcast('STOPPED', mockData['STOPPED']);
         expect(callback).toHaveBeenCalledWith(mockData['STOPPED'], 'STOPPED');
     });

     it('should allow unsubscribing from events', () => {
         const events = new EventNotifier<TEventTypes>();
         const callback = jest.fn();
         const subscriptionID = events.subscribe(callback);

         events.broadcast('STARTED', mockData['STARTED']);
         expect(callback).toHaveBeenCalledWith(mockData['STARTED'], 'STARTED');

         events.unsubscribe(subscriptionID);

         events.broadcast('STOPPED', mockData['STOPPED']);
         expect(callback).not.toHaveBeenCalledWith(mockData['STOPPED'], 'STOPPED');
     });
});
