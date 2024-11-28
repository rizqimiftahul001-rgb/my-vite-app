import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function DepositWithdrawalHeader(props) {
  return (
    <div className="flex w-full container">
      <div className="flex main_title_wrapper">
        <div className="">
          <Typography className="tracking-tight leading-8 main_title">
            <span className="rootMenu">
              {props.selectedLang.USER} /
            </span>
            {props.selectedLang.DEPOSITWITHDRAWAL}
          </Typography>
          {/* <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Monitor metrics, check reports and review performance
          </Typography> */}
        </div>
        <div className="">
          {/* <Button
            className="whitespace-nowrap"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            Settings
          </Button> */}
          {/* <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={
              <FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>
            }
          >
            {props.selectedLang.export}
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export default DepositWithdrawalHeader;
