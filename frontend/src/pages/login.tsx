import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
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
            // navigate("/main");
            // const result = await axios.get("https://api.kf-21boramae.com/");
            // console.log(result.data);
            setModalStatus("two-factor");
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
