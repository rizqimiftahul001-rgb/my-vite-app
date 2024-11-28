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
  role,
  handleChangePlayabelStatus
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
                  {data?.title}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.vendor}
                </TableCell>
                {/* <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                  style={{ fontWeight: "bold" }}>
                  {data?.platform}
                </TableCell> */}
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data?.type}
                </TableCell>
                {/* <TableCell
                  sx={{
                    textAlign: "center",
                  }}>
                  {data.langs.length > 0 &&
                    data.langs?.find((langObject) => langObject.lang === "en")
                      ?.name}
                </TableCell> */}
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
                    fontWeight: "bold",
                    color: data?.is_playable !== undefined ? (data.is_playable ? "blue" : "red") : "blue",
                  }}>
                  {data?.is_playable !== undefined ? (data.is_playable ? "true" :  "false") : "true"}
                </TableCell>

                      <TableCell
									sx={{
										textAlign: 'center',
									}}>
								   <Button
                      className="flex item-center"
                      variant="contained"
                      color={data?.is_playable !== undefined ? (data.is_playable ? "primary" : "secondary") : "primary"}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => handleChangePlayabelStatus(data.real_id,data?.id,data?.provider_game_id,data?.is_playable==undefined ? false : !data?.is_playable)}>
                        {data?.is_playable !== undefined ? (data.is_playable ? selectedLang.disable_play :  selectedLang.enable_play) : selectedLang.disable_play}
                    </Button>
								</TableCell>

              </StyledTableRow>
            );
          })}
      </TableBody>
    );
  }
};

export default addTableData;
