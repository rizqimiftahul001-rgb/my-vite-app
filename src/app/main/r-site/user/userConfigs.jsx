import betHistoryConfigs from "./bet-history/betHistoryConfigs";
import gameHistoryConfigs from "./game-history/gameHistoryConfigs";
import TransactionHistoryConfigs from "./transaction-history/transactionHistoryConfigs";
import userListConfigs from "./user-list/userListConfigs";
import depositWithdrawalConfigs from "./deposit-withdrawal/depositWithdrawalConfigs";
import AllTransactionHistoryConfigs from "./all-transaction-pot/transactionHistoryConfigs";

const userConfigs = [
  betHistoryConfigs,
  TransactionHistoryConfigs,
  userListConfigs,
  depositWithdrawalConfigs,
  AllTransactionHistoryConfigs,
  gameHistoryConfigs,
];

export default userConfigs;
