import { Subscription } from 'rxjs';

export interface SubscriptionObject {
    [key: string]: (Subscription | Array<Subscription>);
}

export abstract class SubscriptionObjectMethods {
    static clearSubscriptions(...subscriptionArrays) {
        subscriptionArrays.forEach(subscriptions => {
            if (subscriptions) {
                if (subscriptions.constructor === Array) {
                    subscriptions.forEach(subscription => subscription.unsubscribe());
                } else {
                    subscriptions.unsubscribe();
                }
            }
        });
    }

    static clearSubscriptionsObject(subscriptionObject) {
        for (const subscriptionKey in subscriptionObject) {
            if (subscriptionObject[subscriptionKey]) {
                this.clearSubscriptions(subscriptionObject[subscriptionKey]);
            }
        }
    }
}

export const SOM = SubscriptionObjectMethods;