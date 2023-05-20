import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import instance from "API/api";
import qs from "query-string";
import LoadingString from "components/utils/LoadingString";
import AuthService from "API/AuthService";
import FirstRegisterModal from "components/login/FirstRegisterModal";
import TwoFactorModal from "components/login/TwoFactorModal";
import { FriendStatusType } from "constant";
import "styles/global.scss";
import "styles/Redirect.scss";

import { Box } from "@mui/material";
import { LoginStatusActionTypes } from "types/redux/Login";
import { MyInfoActionTypes } from "types/redux/MyInfo";

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
        dispatch({
          type: MyInfoActionTypes.MYINFO_UPDATE,
          payload: {
            nickname: response.data.intraId,
            imgURL: response.data.intraImagePath,
            status: FriendStatusType.login,
          },
        });
        dispatch({ type: LoginStatusActionTypes.STATUS_TWOFACTOR });
      } else {
        dispatch({
          type: MyInfoActionTypes.MYINFO_UPDATE,
          payload: {
            nickname: response.data.userId,
            imgURL: response.data.imgPath,
            status: FriendStatusType.login,
          },
        });
        localStorage.setItem("accessToken", response.data.accessToken);
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.accessToken}`;
        navigate("/game");
      }
    };

    requestLogin();
  }, [navigate, dispatch]);

  return (
    <Box id="Redirect" className="flex-container">
      <img src="../loading.gif" alt="loading_gif" />
      <LoadingString message="로그인 중입니다" />
      <FirstRegisterModal />
      <TwoFactorModal />
    </Box>
  );
};

export default Redirect;
