export interface PaymentProvider {
    createPaymentIntent(amount: number, currency: string): Promise<string>
}
