/** @format */
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { formatLocalDateTime } from "src/app/services/Utility";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const addTableData = (
  agentList,
  page,
  rowsPerPage,
  handleOpenWithdraw,
  selectedLang,
  role
) => {
  if (agentList.length > 0) {
    return (
      <TableBody>
        {/* {createTotalRow()} */}
        {agentList
          // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((data, index) => {
            return (
              <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.id}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.provider_game_id}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.provider_name}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.title}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.vendor}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                  style={{ fontWeight: "bold" }}>
                  {data?.platform}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.type}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {/* {data.langs.filter((data) => data.lang == 'en').name} */}
                  {data.langs.length > 0 &&
                    data.langs?.find((langObject) => langObject.lang === "en")
                      ?.name}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data.langs.length > 0 &&
                    data.langs?.find((langObject) => langObject.lang === "ko")
                      ?.name}
                </TableCell>
                {/* <TableCell
									sx={{
										textAlign: 'center',
									}}>
									code
								</TableCell> */}
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color: data.game_enabled ? "blue" : "red",
                  }}>
                  {data.game_enabled ? "true" : "false"}
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent : "center"
                  }}>
                  <Button
                    className="buttonbox"
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={() => handleOpenWithdraw(data)}>
                    {selectedLang.edit}
                  </Button>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {formatLocalDateTime(data.created_at)}
                </TableCell>
              </StyledTableRow>
            );
          })}
      </TableBody>
    );
  }
};

export default addTableData;
