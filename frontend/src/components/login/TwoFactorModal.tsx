import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { LoginStatusActionTypes } from "types/redux/Login";
import CustomIconButton from "components/utils/CustomIconButton";
import AuthService from "API/AuthService";
import instance from "API/api";
import "styles/Login.scss";
import "styles/global.scss";

import { Button, Modal, ModalDialog, Input } from "@mui/joy";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TwoFactorModal = () => {
  const loginStatus = useSelector((state: IRootState) => state.loginStatus);
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTwoFactorLogin = async () => {
    try {
      let response;
      response = await AuthService.postOtp({
        userId: myInfo.nickname,
        sixDigit: value,
      });
      localStorage.setItem("accessToken", response.data.accessToken);
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.accessToken}`;

      navigate("/game");
    } catch {
      alert("비밀번호가 일치하지 않습니다!");
    }
  };

  return (
    <Modal
      open={loginStatus === "two-factor"}
      onClose={() => {
        dispatch({ type: LoginStatusActionTypes.STATUS_MAIN });
        window.location.href = "/login?error=twofactor_failed";
      }}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>2차 인증 알림</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() => {
                dispatch({ type: LoginStatusActionTypes.STATUS_MAIN });
                window.location.href = "/login?error=twofactor_failed";
              }}
            />
          </Box>
          <Box className="body flex-container">
            <span>2차 인증 비밀번호를 입력하세요.</span>
            <Input
              autoFocus
              type="password"
              slotProps={{ input: { maxLength: 6 } }}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Box>
          <Box className="footer flex-container">
            <Button className="medium-size" onClick={handleTwoFactorLogin}>
              확인
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default TwoFactorModal;
