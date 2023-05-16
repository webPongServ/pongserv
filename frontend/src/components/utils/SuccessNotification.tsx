import { forwardRef } from "react";
import "styles/global.scss";

import { Box } from "@mui/material";
import Alert from "@mui/joy/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

interface SuccessNotificationProps {
  successMessage: string;
}

const SuccessNotification = (props: SuccessNotificationProps, ref: any) => {
  return (
    <Box id="success" ref={ref}>
      <Box className="container">
        <Alert
          startDecorator={<CheckCircleIcon className="check" />}
          color="success"
          endDecorator={
            <IconButton
              color="success"
              onClick={() => {
                ref.current!.style.animationName = "slideup";
              }}
            >
              <CloseIcon />
            </IconButton>
          }
        >
          <Typography color="success">{props.successMessage}</Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default forwardRef(SuccessNotification);
