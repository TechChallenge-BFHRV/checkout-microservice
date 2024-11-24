import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CheckoutController } from './controller/checkout.controller';
import { CreateCheckoutUseCase } from './usecases/checkout.usecase';
import { CheckoutRepository } from './repositories/checkout.repository';
import { Checkout, CheckoutSchema } from './schemas/checkout.schema';
import { IntegrationModule } from './service/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Checkout.name, schema: CheckoutSchema }]), // Registra o esquema aqui
    IntegrationModule,
  ],
  controllers: [CheckoutController],
  providers: [CreateCheckoutUseCase, CheckoutRepository], // Registra o repositório
  exports: [CheckoutRepository], // Exporta se necessário
})
export class AppModule {}
