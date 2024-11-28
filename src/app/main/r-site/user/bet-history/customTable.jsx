import React from "react";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import FuseLoading from "@fuse/core/FuseLoading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

const CustomTable = ({
  selectedprovider,
  columns11,
  columns12,
  handleSort,
  sortOrder_befMo,
  sortOrder_bet,
  sortOrder_date,
  sortOrder_befoMo_1,
  sortOrder_afMo,
  getSortIconBeMo,
  getSortIconBet,
  getSortIconBeMo1,
  getSortIconAfMo,
  renderPayment,
  betData1,
  loading,
  selectedLang,
  role,
  tableCount,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <div>
      <TableContainer>
        <Table aria-label="customized table">
          <TableHead>
            {selectedprovider === 1 && (
              <TableRow>
                {columns11.map((column) => (
                  <StyledTableCell
                    sx={{
                      textAlign: "center",
                      cursor:
                        column.id === "beforeMoney" ||
                        column.id === "bet" ||
                        column.id === "date" ||
                        column.id === "beforeMoney_1" ||
                        column.id === "afterMoney"
                          ? "pointer"
                          : "default",
                    }}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                    {column.id === "beforeMoney"
                      ? getSortIconBeMo(sortOrder_befMo)
                      : column.id === "bet"
                      ? getSortIconBet(sortOrder_bet)
                      : column.id === "date"
                      ? getSortIconBet(sortOrder_date)
                      : column.id === "beforeMoney_1"
                      ? getSortIconBeMo1(sortOrder_befoMo_1)
                      : column.id === "afterMoney"
                      ? getSortIconAfMo(sortOrder_afMo)
                      : ""}
                  </StyledTableCell>
                ))}
              </TableRow>
            )}
            {selectedprovider === 2 && (
              <TableRow>
                {columns12.map((column) => (
                  <StyledTableCell
                    sx={{
                      textAlign: "center",
                      cursor:
                        column.id === "beforeMoney" ||
                        column.id === "bet" ||
                        column.id === "date" ||
                        column.id === "beforeMoney_1" ||
                        column.id === "afterMoney"
                          ? "pointer"
                          : "default",
                    }}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                    {column.id === "beforeMoney"
                      ? getSortIconBeMo(sortOrder_befMo)
                      : column.id === "bet"
                      ? getSortIconBet(sortOrder_bet)
                      : column.id === "date"
                      ? getSortIconBet(sortOrder_date)
                      : column.id === "beforeMoney_1"
                      ? getSortIconBeMo1(sortOrder_befoMo_1)
                      : column.id === "afterMoney"
                      ? getSortIconAfMo(sortOrder_afMo)
                      : ""}
                  </StyledTableCell>
                ))}
              </TableRow>
            )}
          </TableHead>
          {renderPayment()}
        </Table>
        {!betData1.length && !loading && (
          <div
            style={{
              color: "#fff",
              textAlign: "center",
              padding: "1rem",
            }}
          >
            {selectedLang.no_data_available_in_table}
          </div>
        )}
        {loading && <FuseLoading />}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 50, 100, 200, 500]}
        component="div"
        count={tableCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={selectedLang.rows_per_page}
      />
    </div>
  );
};

export default CustomTable;
