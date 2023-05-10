import { Box, CircularProgress } from "@mui/material";
import "styles/global.scss";

const LoadingCircle = () => {
  return (
    <Box className="flex-container">
      <CircularProgress />
    </Box>
  );
};

export default LoadingCircle;
