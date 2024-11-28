import { customSortFunction } from "src/app/services/Utility";

function sortData(initCopystatCasinoUser, sortBy, sortOrder) {
  console.log("sort thing-->>",sortBy,sortOrder)
  return initCopystatCasinoUser.sort((a, b) => {
    if (sortBy == "bet_money") {
      return sortOrder === "asc"
        ? a?.betAmount - b?.betAmount
        : b?.betAmount - a?.betAmount;
    } else if (sortBy === "winning") {
      return sortOrder === "asc"
        ? a?.winningAmount - b?.winningAmount
        : b?.winningAmount - a?.winningAmount;
    } else if (sortBy == "profit_loss") {
      const val1 = a?.profitOrLoss;
      const val2 = b?.profitOrLoss;
      return customSortFunction(val1, val2, sortOrder);
    } else if (sortBy == "no_bet") {
      return sortOrder === "asc"
        ? a?.numOfBets - b?.numOfBets
        : b?.numOfBets - a?.numOfBets;
    } else if (sortBy == "no_win") {
      return sortOrder === "asc"
        ? a?.numOfWins - b?.numOfWins
        : b?.numOfWins - a?.numOfWins;
    } else if (sortBy == "refund_money") {
      return sortOrder === "asc"
        ? a?.refund_total_sum - b?.refund_total_sum
        : b?.refund_total_sum - a?.refund_total_sum;
    }  else if (sortBy == "cancel_money") {
      return sortOrder === "asc"
        ? a?.cancel_total_sum - b?.cancel_total_sum
        : b?.cancel_total_sum - a?.cancel_total_sum;
    } else if (sortBy == "no_casino_user") {
      return sortOrder === "asc"
        ? a?.revenue.casinoUser - b?.revenue.casinoUser
        : b?.revenue.casinoUser - a?.revenue.casinoUser;
    } else if (sortBy == "casino") {
      return sortOrder === "asc"
        ? a?.casinoUser[0].localeCompare(b?.casinoUser[0])
        : b?.casinoUser[0].localeCompare(a?.casinoUser[0]);
    } else if (sortBy == "agent") {
      return sortOrder === "asc"
        ? a?.agent[0].localeCompare(b?.agent[0])
        : b?.agent[0].localeCompare(a?.agent[0]);
    }
  });
}

export default sortData;

// const handleSort = (column) => {
//   if (
//     column == "bet_money" ||
//     column == "winning" ||
//     column == "profit_loss" ||
//     column == "no_bet" ||
//     column == "no_win"
//   ) {
//     if (column === "bet_money") {
//       setSortBy("bet_money");
//       setSortOrder_bet_money(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     } else if (column === "winning") {
//       setSortBy("winning");
//       setSortOrder_winning(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     } else if (column == "profit_loss") {
//       setSortBy("profit_loss");
//       setSortOrder_profit_loss(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       getAgentName();
//     } else if (column == "no_bet") {
//       setSortBy("no_bet");
//       setSortedOrder_no_bet(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     } else if (column == "no_win") {
//       setSortBy("no_win");
//       setSortedOrder_no_win(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     }
//   }
// };

// const initCopystatCasinoUser = [...casinoUsers].slice(
// 	page * rowsPerPage,
// 	page * rowsPerPage + rowsPerPage
// );

// old sorting
// const val1 = a?.profitOrLoss;
// const val2 = b?.profitOrLoss;
// if (sortOrder === "asc") {
//   if (val1 > 0 && val2 == 0) return 1;
//   if (val1 < 0 && val2 == 0) return 1;

//   if (val2 > 0 && val1 == 0) return -1;
//   if (val2 < 0 && val1 == 0) return -1;
// }

// if (val1 > 0 && val2 > 0) return val1 - val2;
// if (val1 > 0 && val2 == 0) return -1;
// if (val1 < 0 && val2 == 0) return -1;

// if (val2 > 0 && val1 == 0) return 1;
// if (val2 < 0 && val1 == 0) return 1;

// if (val1 < 0 && val2 > 0) return -1;
// if (val1 > 0 && val2 < 0) return 1;
// if (val1 < 0 && val2 < 0) return val1 - val2;
