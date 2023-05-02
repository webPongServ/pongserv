import { useNavigate } from "react-router-dom";
import LoadingString from "components/common/utils/LoadingString";
import "styles/global.scss";
import "styles/Redirect.scss";

import { Box } from "@mui/material";

const Redirect = () => {
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/game");
  }, 3000);

  return (
    <Box id="Redirect" className="flex-container">
      <img src="../loading.gif" alt="loading_gif" />
      <LoadingString message="로딩 중입니다" />
    </Box>
  );
};

export default Redirect;
