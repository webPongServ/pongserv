import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { LoginStatusActionTypes } from "types/redux/Login";
import CustomIconButton from "components/common/utils/CustomIconButton";
import AuthService from "API/AuthService";
import "styles/Login.scss";
import "styles/global.scss";

import { Button, Modal, ModalDialog, Input } from "@mui/joy";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const TwoFactorModal = () => {
  const loginStatus = useSelector((state: IRootState) => state.loginStatus);
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch();
  const navigate = useNavigate;

  return (
    <Modal
      open={loginStatus === "two-factor"}
      onClose={() => dispatch({ type: LoginStatusActionTypes.STATUS_MAIN })}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>2차 인증 알림</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() =>
                dispatch({ type: LoginStatusActionTypes.STATUS_MAIN })
              }
            />
          </Box>
          <Box className="body flex-container">
            <span>2차 인증 비밀번호를 입력하세요.</span>
            <Input
              type="password"
              slotProps={{ input: { maxLength: 20 } }}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Box>
          <Box className="footer flex-container">
            <Button
              className="medium-size"
              onClick={async () => {
                const response = AuthService.postOtp({
                  userId: "chanhyle",
                  sixDigit: value,
                });

                // if (response.data.result) navigate("/game");
              }}
            >
              확인
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default TwoFactorModal;
