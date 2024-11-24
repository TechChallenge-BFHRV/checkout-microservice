import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Checkout, CheckoutStatus } from '../schemas/checkout.schema';

@Injectable()
export class CheckoutRepository {
  constructor(
    @InjectModel(Checkout.name) private checkoutModel: Model<Checkout>,
  ) {}

  async create(data: Partial<Checkout>): Promise<Checkout> {
    const checkout = new this.checkoutModel(data);
    return checkout.save();
  }

  async updateStatus(id: string, status: CheckoutStatus): Promise<Checkout> {
    return this.checkoutModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}
