import { useBankingContext } from '../context/BankingContext';

export function useBanking() {
  return useBankingContext();
}
