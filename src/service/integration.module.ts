import { forwardRef, Module } from '@nestjs/common';
import { FakePaymentGatewayAdapter } from './fake-payment-gateway';
import { PaymentGateway } from '../adapters/interfaces/payment-gateway';
import { AppModule } from '../app.module';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    {
      provide: PaymentGateway,
      useClass: FakePaymentGatewayAdapter,
    },
  ],
  exports: [
    {
      provide: PaymentGateway,
      useClass: FakePaymentGatewayAdapter,
    },
  ],
})
export class IntegrationModule {}
