import { useState } from "react";
import { authURL } from "API/LoginService";
import { apiURL } from "API/api";
// import { useNavigate } from "react-router-dom";
import NewSessionModal from "components/login/NewSessionModal";
import TwoFactorModal from "components/login/TwoFactorModal";
import "styles/Login.scss";

import { Box } from "@mui/material";
import Button from "@mui/joy/Button";

const Login = () => {
  // const navigate = useNavigate();
  const [modalStatus, setModalStatus] = useState<string>("closed");

  return (
    <Box id="Login" className="flex-container">
      <Box>
        <Button
          onClick={() => {
            // 왜 redirect? 그냥 호출하면 42 intra 서버로부터 CORS 에러가 발생
            window.location.href = apiURL + authURL("authorize");
          }}
        >
          Login with 42
        </Button>
      </Box>
      <NewSessionModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
      />
      <TwoFactorModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
      />
    </Box>
  );
};

export default Login;
