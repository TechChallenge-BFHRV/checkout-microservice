import { PaymentGateway } from '../adapters/interfaces/payment-gateway';
import { getRandomValues } from 'crypto';

export class FakePaymentGatewayAdapter implements PaymentGateway {
  async execute(amount: number): Promise<boolean> {
    if (amount < 0) {
      return false;
    }

    return new Promise((resolve) => {
      const arr = new Uint32Array(1);
      getRandomValues(arr);
      const randomValue = arr[0] / (0xFFFFFFFF + 1);

      setTimeout(() => {
        resolve(randomValue > 0.33);
      }, 1000);
    });
  }
}