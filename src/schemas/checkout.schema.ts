import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CheckoutStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Checkout extends Document {
  @Prop({ required: true })
  orderId: number;

  @Prop({ required: false })
  customerId: number;

  @Prop({ enum: CheckoutStatus, default: CheckoutStatus.PENDING })
  status: CheckoutStatus;
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout);
