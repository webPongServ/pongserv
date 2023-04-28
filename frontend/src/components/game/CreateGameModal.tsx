import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "components/common/utils/CustomInput";
import CustomSlider from "components/common/utils/CustomSlider";
import GameDifficultyRadioGroup from "components/common/utils/GameDifficultyRadioGroup";
import { GameRoomForm } from "types/Form";
import "styles/global.scss";
import "styles/Game.scss";

import { Typography, Box } from "@mui/material";
import { Button, Modal, ModalDialog, IconButton } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

type CreateGameModalProps = {
  roomStatus: string;
  setRoomStatus: Function;
};

const CreateGameModal = (props: CreateGameModalProps) => {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState<string>("203404250001");
  const [gameRoomForm, setGameRoomForm] = useState<GameRoomForm>({
    title: "",
    maxScore: 5,
    difficulty: "easy",
  });

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setGameRoomForm({ ...gameRoomForm, title: target.value });
    }
  };

  const handleMaxScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setGameRoomForm({
        ...gameRoomForm,
        maxScore: parseInt(target.value),
      });
    }
  };

  const handleDifficulty = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setGameRoomForm({
        ...gameRoomForm,
        difficulty: target.value,
      });
    }
  };

  console.log(setRoomID);

  return (
    <Modal
      open={props.roomStatus === "create-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="game-modal-big" variant="outlined">
        <Box sx={{ p: 3, height: "100%" }}>
          <Box className="flex-container" sx={{ height: "10%" }}>
            <Typography sx={{ fontSize: "20px" }}>
              <b>일반 게임 생성</b>
            </Typography>
            <IconButton
              sx={{ marginLeft: "auto" }}
              onClick={() => props.setRoomStatus("game")}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            className="flex-container align-normal justify-normal"
            sx={{
              flexDirection: "column",
              height: "80%",
              gap: 3,
              paddingTop: "5%",
            }}
          >
            <CustomInput
              name="제목"
              defaultValue=""
              handleFunction={handleTitle}
            />
            <CustomSlider
              name="점수"
              defaultValue={5}
              min={1}
              max={10}
              handleFunction={handleMaxScore}
            />
            <GameDifficultyRadioGroup
              name="난이도"
              defaultValue="normal"
              handleFunction={handleDifficulty}
            />
          </Box>
          <Box className="flex-container" sx={{ height: "10%" }}>
            <Button
              sx={{ width: "80%" }}
              onClick={() => navigate(`/game/${roomID}`)}
            >
              생성
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default CreateGameModal;
