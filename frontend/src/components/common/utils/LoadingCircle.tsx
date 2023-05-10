import { Box, CircularProgress } from "@mui/material";
import "styles/global.scss";

const LoadingCircle = () => {
  return (
    <Box className="flex-container" sx={{ height: "100%" }}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingCircle;
