import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { CSVLink } from "react-csv";

function depositHistoryHeader(props) {
  return (
    <div className="flex w-full container">
      <div className="flex main_title_wrapper">
        <div className="flex flex-col flex-auto">
          <Typography className="tracking-tight leading-8 main_title">
            <span className="rootMenu">
              {props.selectedLang.POT} /
            </span>
            {props.selectedLang.withdraw_history}
          </Typography>
          {/* <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Monitor metrics, check reports and review performance
          </Typography> */}
        </div>
        <div className="download_button_wrapper">
          {
            props.csv_data && props.csv_data.length > 0 &&
            <CSVLink
              data={props.csv_data}
              className="download_tag"
              filename={props.csv_filename}
              headers={props.csv_header}>
              <div
                className="download_button"
                style={{ width: "70px" }}
              >
                {selectedLang.Excel}
              </div>

            </CSVLink>
          }
        </div>
      </div>
    </div>
  );
}

export default depositHistoryHeader;
