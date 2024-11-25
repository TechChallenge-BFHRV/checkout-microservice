import { Injectable, Inject } from '@nestjs/common';
import { CheckoutRepository } from '../repositories/checkout.repository';
import { CheckoutStatus } from '../schemas/checkout.schema';
import { PaymentGateway } from '../adapters/interfaces/payment-gateway';

@Injectable()
export class ProcessCheckoutUseCase {
    constructor(
        private readonly checkoutRepository: CheckoutRepository,
        @Inject(PaymentGateway) private readonly paymentGateway: PaymentGateway,
    ) {}

    async execute(checkoutId: string, totalPrice: number) {
        const paymentSucceed = await this.paymentGateway.execute(totalPrice);
        const updatedCheckout = await this.checkoutRepository.updateStatus(
            checkoutId,
            paymentSucceed ? CheckoutStatus.APPROVED : CheckoutStatus.REJECTED,
        );
        return updatedCheckout;
    }
}
