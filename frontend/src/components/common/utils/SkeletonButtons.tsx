import "styles/Profile.scss";
import "styles/global.scss";

import { Skeleton } from "@mui/material";

const SkeletonButtons = () => {
  return (
    <>
      <Skeleton className="skeleton-button" variant="rectangular" />
      <Skeleton className="skeleton-button" variant="rectangular" />
      <Skeleton className="skeleton-button" variant="rectangular" />
    </>
  );
};

export default SkeletonButtons;
