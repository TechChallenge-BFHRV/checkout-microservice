import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from '../controller/checkout.controller';
import { CreateCheckoutUseCase } from '../usecases/checkout.usecase';
import { CheckoutRepository } from '../repositories/checkout.repository';
import { CheckoutStatus } from '../schemas/checkout.schema';
import { PaymentGateway } from '../adapters/interfaces/payment-gateway';
import { ProcessCheckoutUseCase } from '../usecases/process-checkout.usecase';

const feature = loadFeature('./src/test/features/Checkout.feature');

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
  let controller: CheckoutController;
  let createCheckoutUseCase: CreateCheckoutUseCase;

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
    controller = module.get<CheckoutController>(CheckoutController);
    createCheckoutUseCase = module.get<CreateCheckoutUseCase>(CreateCheckoutUseCase);
    });

    test('Instantiate Checkout', ({ given, when, then, and }) => {
        let sampleOrder;
        let executeUseCase;
        given('the user has started an order with valid items', () => {
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
        });
        when('the user initiates the checkout process', async () => {
          executeUseCase = await createCheckoutUseCase.execute(sampleOrder.orderId, sampleOrder.customerId);
        });

        then('the checkout should be initiated successfully', () => {
          expect(executeUseCase).toBeDefined();
        });

        and('the microservice should return a confirmation with the checkout ID', () => {
          expect(executeUseCase._id).toBeTruthy();
        });
    });
});