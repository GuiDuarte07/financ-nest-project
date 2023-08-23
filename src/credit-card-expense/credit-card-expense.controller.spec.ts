import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardExpenseController } from './credit-card-expense.controller';
import { CreditCardExpenseService } from './credit-card-expense.service';

describe('CreditCardExpenseController', () => {
  let controller: CreditCardExpenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditCardExpenseController],
      providers: [CreditCardExpenseService],
    }).compile();

    controller = module.get<CreditCardExpenseController>(CreditCardExpenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
