import { v4 as uuid } from 'uuid';

 export type TEventCallback<TEventTypes extends Object> = (
     data: TEventTypes[keyof TEventTypes],
     event: keyof TEventTypes,
 ) => any;

 export class EventNotifier<TEventTypes extends Record<string, any> = {}> {
     // internal record of which events are subscribed to
     protected subscriptions: Array<{
         callback: TEventCallback<TEventTypes>;
         eventTypes: Array<keyof TEventTypes>;
         id: string;
     }> = [];

     /**
      * Publishes an event to all subscribers.
      * 
      * @param {keyof TEventTypes} type The type of event this is
      * @param {TEventTypes[keyof TEventTypes]} data Data matching this event type
      * @returns {void}
      */
      public broadcast(
         type: keyof TEventTypes,
         data: TEventTypes[keyof TEventTypes],
     ): void {
         // find all subscriptions to this broadcast type
         const subscriptions = this.subscriptions.filter(({ eventTypes }) => eventTypes.length === 0 || eventTypes.includes(type));

         // fire them
         subscriptions.forEach(subscription => {
             subscription.callback(data, type);
         });
     }

     /**
      * Subscribe to one or more events.
      * 
      * @param {TEventCallback<TEventTypes>} callback This will be called whenever a matching event is broadcast
      * @param {Array<keyof TEventTypes> = []} eventTypes Specify which events to listen to. Omit to listen to all events.
      * @returns {string} The ID of this subscription. Use it to unsubscribe.
      */
     public subscribe(
         callback: TEventCallback<TEventTypes>,
         eventTypes: Array<keyof TEventTypes> = [],
     ): string {
         const id = uuid();

         this.subscriptions.push({
             callback,
             eventTypes,
             id,
         });

         return id;
     }

     /**
      * Remove a previous subscription.
      * 
      * @param {string} subscriptionId ID of the subscription to remove, provided by the subscribe() method
      * @returns {void}
      */
     public unsubscribe(subscriptionId: string): void {
         const index = this.subscriptions.findIndex(({ id }) => id === subscriptionId);

         if (index > -1) {
             this.subscriptions.splice(index, 1);
         }
     }
}
