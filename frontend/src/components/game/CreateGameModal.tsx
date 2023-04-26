import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import "styles/Game.scss";

type CreateGameModalProps = {
  roomStatus: string;
  setRoomStatus: Function;
};

const CreateGameModal = (props: CreateGameModalProps) => {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState<string>("203404250001");

  console.log(setRoomID);

  return (
    <Modal
      open={props.roomStatus === "create-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="game-modal" variant="outlined">
        <Typography
          sx={{ height: "10%", fontSize: "30px", margin: "auto auto" }}
        >
          일반 게임
        </Typography>
        <Box
          className="flex-container direction-column"
          sx={{ height: "70%", gap: 1 }}
        >
          <Typography>입장과 동시에 게임이 시작됩니다.</Typography>
          <Typography>
            <b>입장하시겠습니까?</b>
          </Typography>
        </Box>
        <Box className="modal-button-group">
          <Button
            className="medium-size"
            onClick={() => {
              navigate(`/game/${roomID}`);
            }}
          >
            생성
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

export default CreateGameModal;
