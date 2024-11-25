import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateCheckoutDTO } from '../pkg/dtos/create-checkout-dto';
import { CreateCheckoutUseCase } from '../usecases/checkout.usecase';
import { ProcessCheckoutUseCase } from '../usecases/process-checkout.usecase';

@Controller()
export class CheckoutController {
  constructor(
    private readonly createCheckoutUseCase: CreateCheckoutUseCase,
    private readonly processCheckoutUseCase: ProcessCheckoutUseCase,
  ) {}

  @MessagePattern('create_checkout')
  async createCheckout(@Payload() createCheckoutDTO: CreateCheckoutDTO) {
    const checkout = await this.createCheckoutUseCase.execute(
      createCheckoutDTO.orderId,
      createCheckoutDTO.customerId,
    );
    const checkoutCreated = checkout.status === 'PENDING';
    return {
      statusCode: checkoutCreated ? 200 : 400,
      message: checkoutCreated
        ? 'Checkout created successfully.'
        : 'Checkout could not bre created. Try again',
      data: checkout,
    };
  }

  @MessagePattern('process_checkout')
  async processCheckout(@Payload() checkoutData) {
    const processedCheckout = await this.processCheckoutUseCase.execute(checkoutData.id, checkoutData.totalPrice);
    const isSuccess = processedCheckout.status === 'APPROVED';
    return {
      statusCode: isSuccess ? 200 : 400,
      message: isSuccess
        ? 'Payment approved.'
        : 'Payment rejected. Try again',
      data: processedCheckout,
    };
  }
}
