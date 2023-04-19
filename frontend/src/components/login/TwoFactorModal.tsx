import * as React from "react";
import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import { Input } from "@mui/joy";
import "styles/Modal.scss";

type HandleModalStatus = { modalStatus: string; setModalStatus: Function };

const TwoFactorModal = (props: HandleModalStatus) => {
  return (
    <Modal
      open={props.modalStatus === "TwoFactor"}
      onClose={() => props.setModalStatus("closed")}
    >
      <ModalDialog
        size="lg"
        variant="outlined"
        aria-labelledby="variant-modal-title"
        aria-describedby="variant-modal-description"
      >
        <Box className="modal-message modal-flex modal-center">
          <Typography>2차 인증 비밀번호를 입력하세요.</Typography>
          <Input type="password" />
        </Box>
        <Box className="modal-button-group">
          <Button className="medium-size">확인</Button>
          <Button
            variant="outlined"
            className="medium-size"
            onClick={() => props.setModalStatus("closed")}
          >
            취소
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default TwoFactorModal;
