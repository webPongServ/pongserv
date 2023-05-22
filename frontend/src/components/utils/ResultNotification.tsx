import { forwardRef } from "react";
import "styles/global.scss";

import { Box } from "@mui/material";
import Alert from "@mui/joy/Alert";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

interface ResultNotificationProps {
  resultMessage: string;
}

const ResultNotification = (props: ResultNotificationProps, ref: any) => {
  return (
    <Box id="result" ref={ref}>
      <Box className="container">
        <Alert
          startDecorator={<InfoIcon className="result" />}
          color="info"
          endDecorator={
            <IconButton
              color="info"
              onClick={() => {
                ref.current!.style.animationName = "slideup";
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <Typography color="info">{props.resultMessage}</Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default forwardRef(ResultNotification);
