import CustomIconButton from "components/common/utils/CustomIconButton";
import "styles/Game.scss";
import "styles/global.scss";

import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EditProfileModalProps {
  modalStatus: string;
  setModalStatus: Function;
}

const EditProfileModal = (props: EditProfileModalProps) => {
  return (
    <Modal
      open={props.modalStatus === "edit-profile"}
      onClose={() => props.setModalStatus("closed")}
    >
      <ModalDialog className="big modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>정보 수정</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() => props.setModalStatus("closed")}
            />
          </Box>
          <Box className="body flex-container">
            <span>상대방을 찾기까지 일정 시간이 소요됩니다.</span>
            <b>시작하시겠습니까?</b>
          </Box>
          <Box className="footer flex-container">
            <Button>시작</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default EditProfileModal;
