import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && value > total) {
      throw new AppError('Value > Total');
    }

    let checkCategoryExist = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategoryExist) {
      checkCategoryExist = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(checkCategoryExist);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: checkCategoryExist,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
