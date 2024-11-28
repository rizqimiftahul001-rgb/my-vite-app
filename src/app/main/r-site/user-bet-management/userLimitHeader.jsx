import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function winManagemntHeader(props) {
  return (
    <div className="flex w-full container">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0 mytop_title">
        <div className="flex main_title_wrapper">
          <Typography className="tracking-tight leading-8 main_title">
            {`${props.selectedLang.USERBETMANAGEMENT}  ${props?.userInfo?.username!=undefined ? `(${props?.userInfo?.username})` : ''}`}
          </Typography>
          {/* <Typography
            className="font-medium tracking-tight"
            color="text.secondary"
          >
            Monitor metrics, check reports and review performance
          </Typography> */}
        </div>
        {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            Settings
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={
              <FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>
            }
          >
            {props.selectedLang.export}
          </Button>
        </div> */}
      </div>
    </div>
  );
}

export default winManagemntHeader;
