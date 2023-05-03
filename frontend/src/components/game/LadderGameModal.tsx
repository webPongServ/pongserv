import { useNavigate } from "react-router-dom";
import CustomIconButton from "components/common/utils/CustomIconButton";
import "styles/Game.scss";
import "styles/global.scss";

import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface LadderGameModalProps {
  roomStatus: string;
  setRoomStatus: Function;
}

const LadderGameModal = (props: LadderGameModalProps) => {
  const navigate = useNavigate();
  return (
    <Modal
      open={props.roomStatus === "ladder-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>래더 게임</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() => props.setRoomStatus("game")}
            />
          </Box>
          <Box className="body flex-container">
            <span>상대방을 찾기까지 일정 시간이 소요됩니다.</span>
            <b>시작하시겠습니까?</b>
          </Box>
          <Box className="footer flex-container">
            <Button
              onClick={() => {
                navigate(`/game/ladder`);
              }}
            >
              시작
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default LadderGameModal;
