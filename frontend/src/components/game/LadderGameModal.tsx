import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "components/utils/CustomIconButton";
import { IRootState } from "components/common/store";
import { CurrentGameActionTypes } from "types/redux/CurrentGame";
import { GameDifficultyType, GameRoomType } from "constant";
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
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const gameSocket = useSelector(
    (state: IRootState) => state.sockets.gameSocket
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
                gameSocket.emit("ladderGame", (data: any) => {
                  if (data.action === "create") {
                    dispatch({
                      type: CurrentGameActionTypes.UPDATE_GAMEROOM,
                      payload: {
                        id: data.roomId,
                        title: "ladder game",
                        owner: myInfo.nickname,
                        ownerImage: myInfo.imgURL,
                        maxScore: 5,
                        difficulty: GameDifficultyType.hard,
                      },
                    });
                  } else if (data.action === "join") {
                    dispatch({
                      type: CurrentGameActionTypes.UPDATE_GAMEROOM,
                      payload: {
                        id: data.roomId,
                        title: "ladder game",
                        owner: data.owner,
                        ownerImage: "",
                        maxScore: 5,
                        difficulty: GameDifficultyType.hard,
                      },
                    });
                    gameSocket.emit("gameRoomFulfilled", {
                      roomId: data.roomId,
                      type: GameRoomType.ladder,
                    });
                  }
                  navigate(`/game/${data.roomId}`);
                });
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
