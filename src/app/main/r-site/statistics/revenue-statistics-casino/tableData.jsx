import { TableBody, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/styles";
import React from "react";
import { casinoUserMenu } from "src/app/services/Utility";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const addTableData = ({
  casinoUsers,
  loading,
  sortedAndMappedCasinoUser,
  createSumRow,
  page,
  rowsPerPage,
  selectedLang,
  navigate,
}) => {
  if (casinoUsers.length > 0) {
    console.log(sortedAndMappedCasinoUser)
    return (
      <TableBody>
        {createSumRow()}
        {!loading &&
          sortedAndMappedCasinoUser
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                    style={{ fontWeight: "bold" }}
                  >
                    {/* {data?.casinoUser} */}
                    {casinoUserMenu(selectedLang, data?.casinoUser, navigate)}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data?.agent} */}
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <span
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            {...bindTrigger(popupState)}
                          >
                            {data?.agent}
                          </span>
                          <Menu {...bindMenu(popupState)}>
                            {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/mypage?agent_id=${data?.agent_id}`);
                              }}
                            >
                              {selectedLang.MYPAGE}
                            </MenuItem>
                            {/* )} */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/transactionHistory?agent=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYAGENT}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/agentTreeList?q_agent=${data?.agent_id}`
                                );
                              }}
                            >
                              {selectedLang.change_password}
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/agentRevenueStatistics?agent=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.AGENTRSTATISTICS}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/statisticsByGame?agent_id=${data?.agent_id}`
                                );
                              }}
                            >
                              {selectedLang.statisticsByGame}
                            </MenuItem>
                            {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/providerManagement?agent_id=${data?.agent_id}`
                                );
                              }}
                            >
                              {selectedLang.PROVIDERMANAGEMENT}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/gameManagement?agent_id=${data?.agent_id}`
                                );
                              }}
                            >
                              {selectedLang.GAMEMANAGEMENT}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/APIerror?agent_id=${data?.agent_id}`
                                );
                              }}
                            >
                              {selectedLang.APIERRORLOG}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/userList?agent=${data?.agent}`);
                              }}
                            >
                              {selectedLang.USERLIST}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/user/transactionHistory?agent=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYUSER}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/user/betHistory?agent=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.BETHISTORY}
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.betAmount)?.toLocaleString()}
                  </TableCell>
                                    <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.refund_total_sum)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.cancel_total_sum)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color:
                        Number(data?.winningAmount) < 0
                          ? "red"
                          : Number(data?.winningAmount) > 0
                          ? "#35cdd9"
                          : "white",
                    }}
                  >
                    {Number(data?.winningAmount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color:
                        Number(data?.profitOrLoss) < 0
                          ? "red"
                          : Number(data?.profitOrLoss) > 0
                          ? "#35cdd9"
                          : "white",
                    }}
                  >
                    {Number(data?.profitOrLoss)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.numOfBets)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.numOfWins)?.toLocaleString()}
                  </TableCell>
                </StyledTableRow>
              );
            })}
      </TableBody>
    );
  }
};
export default addTableData;
