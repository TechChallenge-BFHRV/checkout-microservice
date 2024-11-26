import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from '../controller/checkout.controller';
import { CreateCheckoutUseCase } from '../usecases/checkout.usecase';
import { CheckoutRepository } from '../repositories/checkout.repository';
import { CheckoutStatus } from '../schemas/checkout.schema';
import { PaymentGateway } from '../adapters/interfaces/payment-gateway';
import { ProcessCheckoutUseCase } from '../usecases/process-checkout.usecase';

const feature = loadFeature('./src/test/features/Payment.feature');

const mockCheckoutRepository = {
  create: jest.fn().mockResolvedValue({
    id: '1',
    orderId: 123,
    customerId: 456,
    status: CheckoutStatus.PENDING,
    _id: '1234567890randomstring',
  }),
  updateStatus: jest.fn().mockResolvedValue({
    id: '1',
    status: CheckoutStatus.APPROVED,
  }),
};

class MockPaymentGateway implements PaymentGateway {
  execute = jest.fn().mockImplementation(() => {
    const isSuccess = true; 
    return Promise.resolve(isSuccess); 
  });
}

defineFeature(feature, test => {
  let createCheckoutUseCase: CreateCheckoutUseCase;
  let processCheckoutUseCase: ProcessCheckoutUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CheckoutController],
      providers: [
        CreateCheckoutUseCase,
        ProcessCheckoutUseCase,
        {
          provide: CheckoutRepository,
          useValue: mockCheckoutRepository,
        },
        {
          provide: PaymentGateway,
          useClass: MockPaymentGateway,
        }
      ]
    }).compile();
    createCheckoutUseCase = module.get<CreateCheckoutUseCase>(CreateCheckoutUseCase);
    processCheckoutUseCase = module.get<ProcessCheckoutUseCase>(ProcessCheckoutUseCase);
    });

    test('Successfully process a valid payment', ({ given, when, then, and }) => {
        let sampleOrder;
        let executeUseCase;
        let executeProcessCheckoutUseCase;
        given('the user has initiated the checkout process', async () => {
            sampleOrder = {
                orderId: 1,
                customerId: null,
                status: 'STARTED',
                step: 'DESERT',
                orderItems: [
                    {
                        id: 11,
                        orderId: 1,
                        isActive: true,
                        itemId: 1,
                    }
                ],
                totalPrice: 10,
                finalPrice: 10,
                preparationTime: 30,
            };
            executeUseCase = await createCheckoutUseCase.execute(sampleOrder.orderId, sampleOrder.customerId);
        });
        and('the checkout process returned a valid checkout ID', async () => {
          expect(executeUseCase._id).toBeTruthy();
        });

        when('the user provides payment details and the payment gateway confirms the transaction', async () => {
          executeProcessCheckoutUseCase = await processCheckoutUseCase.execute(executeUseCase._id, sampleOrder.finalPrice);
        });

        then('the microservice should return a success response with status “Approved”', () => {
          expect(executeProcessCheckoutUseCase.status).toBe('APPROVED');
        });
    });
});