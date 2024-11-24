import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { CheckoutStatus } from '../../schemas/checkout.schema';

export class CreateCheckoutDTO {
  @IsInt()
  orderId: number;

  @IsOptional() 
  @IsInt()
  customerId: number;

  @IsEnum(CheckoutStatus)
  @IsOptional()
  status?: CheckoutStatus = CheckoutStatus.PENDING; 
}
