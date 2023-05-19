import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomInput from "components/utils/CustomInput";
import CustomSlider from "components/utils/CustomSlider";
import GameDifficultyRadioGroup from "components/utils/GameDifficultyRadioGroup";
import { GameRoomForm } from "types/Form";
import CustomIconButton from "components/utils/CustomIconButton";
import { CurrentGameActionTypes } from "types/redux/CurrentGame";
import { IRootState } from "components/common/store";
import { GameDifficultyType, GameRoomType } from "constant";
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
  const gameSocket = useSelector(
    (state: IRootState) => state.sockets.gameSocket
  );
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [gameRoomForm, setGameRoomForm] = useState<GameRoomForm>({
    title: "",
    maxScore: 5,
    difficulty: GameDifficultyType.normal,
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
              defaultValue={GameDifficultyType.normal}
              handleFunction={handleDifficulty}
            />
          </Box>
          <Box className="footer flex-container">
            <Button
              onClick={() => {
                if (gameRoomForm.title === "")
                  return alert("제목을 입력해주세요!");
                gameSocket.emit(
                  "createGameRoom",
                  {
                    roomName: gameRoomForm.title,
                    score: gameRoomForm.maxScore,
                    difficulty: gameRoomForm.difficulty,
                    type: GameRoomType.normal,
                  },
                  (uuid: string) => {
                    dispatch({
                      type: CurrentGameActionTypes.UPDATE_GAMEROOM,
                      payload: {
                        id: uuid,
                        title: gameRoomForm.title,
                        owner: myInfo.nickname,
                        ownerImage: myInfo.imgURL,
                        maxScore: gameRoomForm.maxScore,
                        difficulty: gameRoomForm.difficulty,
                      },
                    });
                    navigate(`/game/${uuid}`);
                  }
                );
              }}
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
