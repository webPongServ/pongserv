import "styles/Profile.scss";
import "styles/global.scss";

import { Box, Skeleton } from "@mui/material";

const SkeletonProfile = () => {
  return (
    <Box className="flex-container">
      <Skeleton className="skeleton-img" variant="circular" />
      <Box>
        <Skeleton className="skeleton-title" variant="rectangular" />
        <Skeleton className="skeleton-info" variant="rectangular" />
        <Skeleton className="skeleton-info" variant="rectangular" />
      </Box>
    </Box>
  );
};

export default SkeletonProfile;
