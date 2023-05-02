import CustomIconButton from "components/common/utils/CustomIconButton";
import "styles/Login.scss";
import "styles/global.scss";

import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import { Input } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

type HandleModalStatus = { modalStatus: string; setModalStatus: Function };

const TwoFactorModal = (props: HandleModalStatus) => {
  return (
    <Modal
      open={props.modalStatus === "two-factor"}
      onClose={() => props.setModalStatus("closed")}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>2차 인증 알림</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() => props.setModalStatus("closed")}
            />
          </Box>
          <Box className="body flex-container">
            <span>2차 인증 비밀번호를 입력하세요.</span>
            <Input type="password" />
          </Box>
          <Box className="footer flex-container">
            <Button className="medium-size">확인</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default TwoFactorModal;
