import { useNavigate } from "react-router-dom";

import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import "styles/Game.scss";

type LadderGameModalProps = {
  roomStatus: string;
  setRoomStatus: Function;
};

const LadderGameModal = (props: LadderGameModalProps) => {
  const navigate = useNavigate();
  return (
    <Modal
      open={props.roomStatus === "ladder-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="game-modal" variant="outlined">
        <Typography
          sx={{ height: "10%", fontSize: "30px", margin: "auto auto" }}
        >
          래더 게임
        </Typography>
        <Box
          className="flex-container direction-column"
          sx={{ height: "70%", gap: 1 }}
        >
          <Typography>상대방을 찾기까지 일정 시간이 소요됩니다.</Typography>
          <Typography>
            <b>시작하시겠습니까?</b>
          </Typography>
        </Box>
        <Box className="modal-button-group">
          <Button
            className="medium-size"
            onClick={() => {
              navigate(`/game/ladder`);
            }}
          >
            시작
          </Button>
          <Button
            variant="outlined"
            className="medium-size"
            onClick={() => props.setRoomStatus("game")}
          >
            취소
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default LadderGameModal;
