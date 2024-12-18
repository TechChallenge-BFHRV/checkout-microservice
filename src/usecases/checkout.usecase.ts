import { Injectable, Inject } from '@nestjs/common';
import { CheckoutRepository } from '../repositories/checkout.repository';
import { CheckoutStatus } from '../schemas/checkout.schema';
import { PaymentGateway } from '../adapters/interfaces/payment-gateway';

@Injectable()
export class CreateCheckoutUseCase {
    constructor(
        private readonly checkoutRepository: CheckoutRepository,
        @Inject(PaymentGateway) private readonly paymentGateway: PaymentGateway,
    ) {}

    async execute(orderId: number, customerId: number) {
        // Cria o checkout com status PENDING
        const checkout = await this.checkoutRepository.create({
            orderId,
            customerId,
            status: CheckoutStatus.PENDING,
        });
        return checkout;
    }
}
