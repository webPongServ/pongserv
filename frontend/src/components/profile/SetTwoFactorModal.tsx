import { useEffect, useState } from "react";
import CustomIconButton from "components/common/utils/CustomIconButton";
import AuthService from "API/AuthService";
import { useSelector } from "react-redux";
import { IRootState } from "components/common/store";
import "styles/Game.scss";
import "styles/global.scss";

import { Button, Input } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface SetTwoFactorModalProps {
  modalStatus: string;
  setModalStatus: Function;
}

const SetTwoFactorModal = (props: SetTwoFactorModalProps) => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const [QR, setQR] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const handleActivateTwoFactor = async () => {
    try {
      let response;
      response = await AuthService.postActivate2fa({
        userId: myInfo.nickname,
        sixDigit: value,
      });
      alert("2차 인증을 설정하였습니다!");
      props.setModalStatus("closed");
    } catch {
      alert("코드가 유효하지 않습니다. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    const getQR = async () => {
      const response = await AuthService.getQR();
      setQR(response.data);
    };

    getQR();
  }, []);

  return (
    <Modal
      open={props.modalStatus === "set-twofactor"}
      onClose={() => props.setModalStatus("closed")}
    >
      <ModalDialog className="big modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>2차 인증 설정</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() => props.setModalStatus("closed")}
            />
          </Box>
          <Box className="body flex-container">
            <span>2차 인증</span>
            <Box dangerouslySetInnerHTML={{ __html: QR }}></Box>
            <Input
              type="password"
              slotProps={{ input: { maxLength: 6 } }}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </Box>
          <Box className="footer flex-container">
            <Button onClick={handleActivateTwoFactor}>활성화</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default SetTwoFactorModal;
