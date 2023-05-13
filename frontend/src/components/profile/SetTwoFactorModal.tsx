import { useEffect, useState } from "react";
import CustomIconButton from "components/utils/CustomIconButton";
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
  const [isDone, setIsDone] = useState<boolean>(false);

  const handleActivateTwoFactor = async () => {
    try {
      const response = await AuthService.postActivate2fa({
        userId: myInfo.nickname,
        sixDigit: value,
      });
      setIsDone(true);
    } catch {
      alert("코드가 유효하지 않습니다. 다시 시도해 주세요.");
    }
  };

  useEffect(() => {
    const getQR = async () => {
      const response = await AuthService.getQR();
      setQR(response.data);
    };

    if (props.modalStatus === "set-twofactor") getQR();
  }, [props.modalStatus]);

  return (
    <Modal
      open={props.modalStatus === "set-twofactor"}
      onClose={() => props.setModalStatus("closed")}
    >
      <ModalDialog className="modal big-modal" variant="outlined">
        <Box id="two-factor" className="outframe">
          <Box className="header flex-container">
            <b>2차 인증 설정</b>
            <CustomIconButton
              class="red right"
              icon={<CloseIcon />}
              handleFunction={() => props.setModalStatus("closed")}
            />
          </Box>
          <Box className="body flex-container">
            <Box dangerouslySetInnerHTML={{ __html: QR }}></Box>
            <Input
              type="password"
              slotProps={{
                input: { maxLength: 6 },
              }}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <Box className="content">
              <span>
                1. 앱 스토어에서 Google Authenticator를 설치한 후, Google
                로그인을 진행
              </span>
              <span>2. 앱 오른쪽 아래 + 버튼 클릭 후, QR 코드 스캔을 클릭</span>
              <span>3. 카메라를 이용하여 위 QR 코드를 스캔</span>
              <span>
                4. 스캔 후, 6자리 숫자 코드(SecretKey)를 입력한 후 활성화 버튼을
                클릭
              </span>
            </Box>
          </Box>
          <Box className="footer flex-container">
            <Button onClick={handleActivateTwoFactor} disabled={isDone}>
              {isDone ? "2차 인증 설정이 완료되었습니다." : "활성화"}
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default SetTwoFactorModal;
