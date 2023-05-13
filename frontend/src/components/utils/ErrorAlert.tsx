import { Box } from "@mui/material";
import Alert from "@mui/joy/Alert";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import "styles/global.scss";

interface ErrorAlertProps {
  divRef: React.RefObject<HTMLDivElement>;
  errorMessage: string;
}

const ErrorAlert = (props: ErrorAlertProps) => {
  return (
    <Box id="alert" ref={props.divRef}>
      <Box className="container">
        <Alert
          startDecorator={<WarningIcon className="warning" />}
          color="danger"
          endDecorator={
            <IconButton
              color="danger"
              onClick={() => {
                props.divRef.current!.style.animationName = "slideup";
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

export default ErrorAlert;
