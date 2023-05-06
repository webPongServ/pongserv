import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import instance from "API/api";
import qs from "query-string";
import LoadingString from "components/common/utils/LoadingString";
import AuthService from "API/AuthService";
import "styles/global.scss";
import "styles/Redirect.scss";

import { Box } from "@mui/material";
import { LoginStatusActionTypes } from "types/redux/Login";

const Redirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const requestLogin = async () => {
      // In this example, the as keyword is used to assert that the variable is a certain type.
      const paramsCode = qs.parse(window.location.search).code as string;
      const response = await AuthService.postCode({
        code: paramsCode,
      });

      if (response.data.OAuthData) {
        dispatch({ type: LoginStatusActionTypes.STATUS_TWOFACTOR });
      } else {
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
      }
      // instance.defaults.headers.common[
      //   "Authorization"
      // ] = `Bearer ${paramsCode}`;

      // setTimeout(() => {
      //   navigate("/game");
      // }, 3000);
    };

    requestLogin();
  }, [navigate]);

  return (
    <Box id="Redirect" className="flex-container">
      <img src="../loading.gif" alt="loading_gif" />
      <LoadingString message="로딩 중입니다" />
    </Box>
  );
};

export default Redirect;
