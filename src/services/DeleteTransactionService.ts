import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const checkIdTransactionExist = await transactionRepository.findOne(id);

    if (!checkIdTransactionExist) {
      throw new AppError('Invalid id');
    }

    await transactionRepository.remove(checkIdTransactionExist);
  }
}

export default DeleteTransactionService;
