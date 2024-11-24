import { forwardRef, Module } from '@nestjs/common';
import { FakePaymentGatewayAdapter } from './fake-payment-gateway';
import { PaymentGateway } from '../adapters/interfaces/payment-gateway';
import { AppModule } from '../app.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [forwardRef(() => AppModule)],
  providers: [
    {
      provide: PaymentGateway,
      useClass: FakePaymentGatewayAdapter,
    },
  ],
  exports: [PaymentGateway], // Exporta o token diretamente
})
export class IntegrationModule {}
