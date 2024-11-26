import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Checkout } from '../schemas/checkout.schema';
import { CreateCheckoutDTO } from '../pkg/dtos/create-checkout-dto';

@Injectable()
export class CheckoutService {
  constructor(@InjectModel(Checkout.name) private readonly checkoutModel: Model<Checkout>) {}

  async create(createCheckoutDTO: CreateCheckoutDTO): Promise<Checkout> {
    // Criando um novo Checkout com os dados do DTO
    const checkout = new this.checkoutModel(createCheckoutDTO);
    return await checkout.save(); // Salvando no MongoDB
  }
}
