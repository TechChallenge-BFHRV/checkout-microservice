import { Test, TestingModule } from '@nestjs/testing';
import { CreateCheckoutUseCase } from '../checkout.usecase';
import { CheckoutRepository } from '../../repositories/checkout.repository';
import { PaymentGateway } from '../../adapters/interfaces/payment-gateway';
import { CheckoutStatus } from '../../schemas/checkout.schema';
import { ProcessCheckoutUseCase } from '../process-checkout.usecase';

const sampleCheckout = {
  id: '1',
  orderId: 123,
  customerId: 456,
  status: CheckoutStatus.PENDING,
};

const mockCheckoutRepository = {
  create: jest.fn().mockResolvedValue({
    id: '1',
    orderId: 123,
    customerId: 456,
    status: CheckoutStatus.PENDING,
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

describe('CreateCheckoutUseCase', () => {
  let createCheckoutUseCase: CreateCheckoutUseCase;
  let mockPaymentGateway: jest.Mocked<PaymentGateway>;

  beforeEach(async () => {
    mockPaymentGateway = new MockPaymentGateway();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCheckoutUseCase,
        ProcessCheckoutUseCase,
        { provide: CheckoutRepository, useValue: mockCheckoutRepository },
        { provide: PaymentGateway, useValue: mockPaymentGateway },
      ],
    }).compile();

    createCheckoutUseCase = module.get<CreateCheckoutUseCase>(CreateCheckoutUseCase);
  });

  it('should create a checkout', async () => {
    mockCheckoutRepository.create.mockResolvedValueOnce({
      id: '1',
      orderId: 123,
      customerId: 456,
      status: CheckoutStatus.PENDING,
    });

    const result = await createCheckoutUseCase.execute(123, 456);
    expect(result.status).toContain(CheckoutStatus.PENDING);
  });
});
