import { forwardRef } from "react";
import "styles/global.scss";

import { Box } from "@mui/material";
import Alert from "@mui/joy/Alert";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

interface ErrorNotificationProps {
  errorMessage: string;
}

const ErrorNotification = (props: ErrorNotificationProps, ref: any) => {
  return (
    <Box id="alert" ref={ref}>
      <Box className="container">
        <Alert
          startDecorator={<WarningIcon className="warning" />}
          color="danger"
          endDecorator={
            <IconButton
              color="danger"
              onClick={() => {
                ref.current!.style.animationName = "slideup";
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <Typography color="danger">{props.errorMessage}</Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default forwardRef(ErrorNotification);
