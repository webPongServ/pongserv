import instance from "API/api";
import UserService from "API/UserService";
// import { useNavigate } from "react-router-dom";

import "styles/Login.scss";

import { Box } from "@mui/material";
import Button from "@mui/joy/Button";

const Login = () => {
  // const navigate = useNavigate();

  const handleLogin = async () => {
    // 왜 redirect? 그냥 호출하면 42 intra 서버로부터 CORS 에러가 발생
    // window.location.href = apiURL + authURL("authorize");
    // window.location.href = apiURL + usersURL("login");
    const token = localStorage.getItem("accessToken");
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await UserService.getLogin();
    window.location.href = `${response.data}`;
  };

  return (
    <Box id="Login" className="flex-container">
      <Box>
        <Button onClick={handleLogin}>Login with 42</Button>
      </Box>
    </Box>
  );
};

export default Login;
