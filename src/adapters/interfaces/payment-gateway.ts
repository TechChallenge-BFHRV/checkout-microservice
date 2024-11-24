export abstract class PaymentGateway {
    abstract execute(amount: number): Promise<boolean>;
  }
  