import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "components/utils/CustomInput";
import CustomSlider from "components/utils/CustomSlider";
import GameDifficultyRadioGroup from "components/utils/GameDifficultyRadioGroup";
import { GameRoomForm } from "types/Form";
import CustomIconButton from "components/utils/CustomIconButton";
import "styles/global.scss";
import "styles/Game.scss";

import { Box } from "@mui/material";
import { Button, Modal, ModalDialog } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

interface CreateGameModalProps {
  roomStatus: string;
  setRoomStatus: Function;
}

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

  return (
    <Modal
      open={props.roomStatus === "create-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="create" className="outframe">
          <Box className="header flex-container">
            <b>일반 게임 생성</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() => props.setRoomStatus("game")}
            />
          </Box>
          <Box className="body flex-container">
            <CustomInput
              name="제목"
              defaultValue=""
              maxLength={20}
              placeholder="최대 20자"
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
          <Box className="footer flex-container">
            <Button onClick={() => navigate(`/game/${roomID}`)}>생성</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default CreateGameModal;
