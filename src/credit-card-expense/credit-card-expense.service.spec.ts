import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardExpenseService } from './credit-card-expense.service';

describe('CreditCardExpenseService', () => {
  let service: CreditCardExpenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreditCardExpenseService],
    }).compile();

    service = module.get<CreditCardExpenseService>(CreditCardExpenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
