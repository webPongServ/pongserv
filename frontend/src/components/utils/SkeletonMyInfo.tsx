import "styles/AppHeader.scss";

import { Box, Skeleton } from "@mui/material";

const SkeletonMyInfo = () => {
  return (
    <Box id="skeleton-my-profile" className="flex-container">
      <Skeleton className="skeleton-img" variant="circular" />
      <Skeleton className="skeleton-nickname" variant="rectangular" />
    </Box>
  );
};

export default SkeletonMyInfo;
