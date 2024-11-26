import { PaymentGateway } from '../adapters/interfaces/payment-gateway';

export class FakePaymentGatewayAdapter implements PaymentGateway {
  async execute(amount: number): Promise<boolean> {
    if (amount < 0) {
      return false;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.33);
      }, 1000);
    });
  }
}