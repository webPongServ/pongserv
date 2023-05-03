import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import qs from "query-string";
import LoadingString from "components/common/utils/LoadingString";
import LoginService from "API/LoginService";
import "styles/global.scss";
import "styles/Redirect.scss";

import { Box } from "@mui/material";

const Redirect = () => {
  const navigate = useNavigate();

  const requestLogin = useCallback(async () => {
    // In this example, the as keyword is used to assert that the variable is a certain type.
    const paramsCode = qs.parse(window.location.search).code as string;
    const response = await LoginService.postCode({
      code: paramsCode,
    });

    console.log(response);

    setTimeout(() => {
      navigate("/game");
    }, 3000);
  }, [navigate]);

  useEffect(() => {
    requestLogin();
  }, [requestLogin]);

  return (
    <Box id="Redirect" className="flex-container">
      <img src="../loading.gif" alt="loading_gif" />
      <LoadingString message="로딩 중입니다" />
    </Box>
  );
};

export default Redirect;
