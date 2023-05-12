import { useNavigate } from "react-router-dom";
import LoadingString from "components/utils/LoadingString";
import "styles/global.scss";
import "styles/Redirect.scss";

import { Box } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  const token: string | null = localStorage.getItem("accessToken");

  setTimeout(() => {
    if (!token) navigate("/login");
    else navigate("/game");
  }, 500);

  return (
    <Box id="Redirect" className="flex-container">
      <img src="../loading.gif" alt="loading_gif" />
      <LoadingString message="이동 중입니다" />
    </Box>
  );
};

export default Home;
