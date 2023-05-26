import Stripe from 'stripe'
import { PaymentProvider } from '../payments.models'

export class StripePaymentProvider implements PaymentProvider {
    private stripe: Stripe

    constructor(private readonly secretKey: string) {
        this.stripe = new Stripe(this.secretKey, { apiVersion: '2022-11-15' })
    }

    /**
     * Creates a Stripe payment intent and returns the client secret.
     * @param amount amount in cents
     * @param currency currency code
     * @returns Stripe Client secret
     */
    public async createPaymentIntent(
        amount: number,
        currency: string,
    ): Promise<string> {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { integration_check: 'accept_a_payment' },
        })

        const clientSecret = paymentIntent.client_secret
        if (!clientSecret) throw new Error('Failed to create payment intent')

        return clientSecret
    }

    public getClient(): Stripe {
        return this.stripe
    }
}
