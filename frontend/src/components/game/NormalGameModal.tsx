import { useNavigate } from "react-router-dom";
import CustomIconButton from "components/utils/CustomIconButton";
import "styles/Game.scss";

import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface NormalGameModalProps {
  roomStatus: string;
  setRoomStatus: Function;
  selectedID: string;
}

const NormalGameModal = (props: NormalGameModalProps) => {
  const navigate = useNavigate();
  return (
    <Modal
      open={props.roomStatus === "normal-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>일반 게임</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() => props.setRoomStatus("game")}
            />
          </Box>
          <Box className="body flex-container">
            <span>입장과 동시에 게임이 시작됩니다.</span>
            <b>입장하시겠습니까?</b>
          </Box>
          <Box className="footer flex-container">
            <Button
              onClick={() => {
                navigate(`/game/${props.selectedID}`);
              }}
            >
              입장
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default NormalGameModal;
