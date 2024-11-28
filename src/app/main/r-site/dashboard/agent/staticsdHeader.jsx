/** @format */
import Typography from "@mui/material/Typography";

function staticsdHeader(props) {
  return (
    <div className="flex w-full container">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 pt-0 pr-24 pb-0 md:pb-0 boxwrapper static_title">
        <div className="flex flex-col flex-auto">
          <Typography className="tracking-tight leading-8 main_title">
            {props.selectedLang.statics}
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default staticsdHeader;