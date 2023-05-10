import "styles/AppHeader.scss";

import { Skeleton } from "@mui/material";

const SkeletonMyInfo = () => {
  return (
    <>
      <Skeleton className="skeleton-img" variant="circular" />
      <Skeleton className="skeleton-nickname" variant="rectangular" />
    </>
  );
};

export default SkeletonMyInfo;
