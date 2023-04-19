import * as React from "react";
import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import "../../styles/Modal.scss";

type HandleModalStatus = { modalStatus: string; setModalStatus: Function };

const NewSessionModal = (props: HandleModalStatus) => {
  return (
    <Modal
      open={props.modalStatus === "NewSession"}
      onClose={() => props.setModalStatus("Closed")}
    >
      <ModalDialog
        size="lg"
        variant="outlined"
        aria-labelledby="variant-modal-title"
        aria-describedby="variant-modal-description"
      >
        <Box className="modal-message modal-flex modal-center">
          <Typography>이미 로그인 중인 아이디입니다.</Typography>
          <Typography>
            <b>기존 로그인을 종료하고 새로 로그인하시겠습니까?</b>
          </Typography>
        </Box>
        <Box className="modal-button-group">
          <Button className="medium-size">확인</Button>
          <Button
            variant="outlined"
            className="medium-size"
            onClick={() => props.setModalStatus("Closed")}
          >
            취소
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default NewSessionModal;
