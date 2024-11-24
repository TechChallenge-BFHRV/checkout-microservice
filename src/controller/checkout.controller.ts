import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCheckoutDTO } from '../pkg/dtos/create-checkout-dto';
import { CreateCheckoutUseCase } from '../usecases/checkout.usecase';

@Controller()
export class CheckoutController {
  constructor(private readonly createCheckoutUseCase: CreateCheckoutUseCase) {}

  @MessagePattern('create_checkout')
  async createCheckout(@Payload() createCheckoutDTO: CreateCheckoutDTO) {
    const checkout = await this.createCheckoutUseCase.execute(
      createCheckoutDTO.orderId,
      createCheckoutDTO.customerId,
    );
    const isSuccess = checkout.status === 'APPROVED';
    return {
      statusCode: isSuccess ? 200 : 400,
      message: isSuccess
        ? 'Payment processed successfully.'
        : 'Payment cannot be processed.',
      data: checkout,
    };
  }
}
