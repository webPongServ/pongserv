import { useNavigate } from "react-router-dom";
import "styles/Game.scss";

import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type NormalGameModalProps = {
  roomStatus: string;
  setRoomStatus: Function;
  selectedID: string;
};

const NormalGameModal = (props: NormalGameModalProps) => {
  const navigate = useNavigate();
  return (
    <Modal
      open={props.roomStatus === "normal-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="game-modal" variant="outlined" sx={{ p: 5 }}>
        <Box className="flex-container" sx={{ height: "10%" }}>
          <Typography sx={{ fontSize: "30px" }}>
            <b>일반 게임</b>
          </Typography>
          <IconButton
            sx={{ marginLeft: "auto" }}
            onClick={() => props.setRoomStatus("game")}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          className="flex-container direction-column"
          sx={{ height: "80%", gap: 1 }}
        >
          <Typography>입장과 동시에 게임이 시작됩니다.</Typography>
          <Typography>
            <b>입장하시겠습니까?</b>
          </Typography>
        </Box>
        <Box className="modal-button-group">
          <Button
            sx={{ width: "80%" }}
            onClick={() => {
              navigate(`/game/${props.selectedID}`);
            }}
          >
            입장
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default NormalGameModal;
