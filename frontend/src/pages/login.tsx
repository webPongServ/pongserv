import { useRef } from "react";
import instance from "API/api";
import UserService from "API/UserService";
// import { useNavigate } from "react-router-dom";
import qs from "query-string";
import "styles/Login.scss";

import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";

import { Box } from "@mui/material";
import Button from "@mui/joy/Button";
import Alert from "@mui/joy/Alert";

const Login = () => {
  const paramsCode: string | undefined = qs.parse(window.location.search)
    .error as string;
  const divRef = useRef<HTMLDivElement>(null);

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
    <>
      {paramsCode === "auth_failed" ? (
        <Box id="auth-inform" ref={divRef}>
          <Box className="container">
            <Alert
              startDecorator={<WarningIcon className="warning" />}
              color="danger"
              endDecorator={
                <IconButton
                  color="danger"
                  onClick={() => {
                    divRef.current!.style.animationName = "slideup";
                  }}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <Typography color="danger">
                로그인 정보가 올바르지 않습니다!
              </Typography>
            </Alert>
          </Box>
        </Box>
      ) : null}
      <Box id="Login" className="flex-container">
        <Box>
          <Button onClick={handleLogin}>Login with 42</Button>
        </Box>
      </Box>
    </>
  );
};

export default Login;
