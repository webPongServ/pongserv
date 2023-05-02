import { useState } from "react";
import GameCard from "components/game/GameCard";
import NormalGameModal from "components/game/NormalGameModal";
import LadderGameModal from "components/game/LadderGameModal";
import CreateGameModal from "components/game/CreateGameModal";
import { useSelector } from "react-redux";
import { IRootState } from "components/common/store";
import "styles/global.scss";
import "styles/Game.scss";

import { Box } from "@mui/system";
import { Button } from "@mui/joy";

const Game = () => {
  const [roomStatus, setRoomStatus] = useState<string>("game");
  const [selectedID, setSelectedID] = useState<string>("");
  const gameRooms = useSelector(
    (state: IRootState) => state.gameRooms.gameRooms
  );

  return (
    <Box id="Game" className="flex-container">
      <Box id="game-box" className="flex-wrap-container overflow">
        {gameRooms.map((value, index) => {
          return (
            <GameCard
              key={value.id + index}
              id={value.id}
              title={value.title}
              owner={value.owner}
              maxScore={value.maxScore}
              difficulty={value.difficulty}
              createdAt={value.createdAt}
              setRoomStatus={setRoomStatus}
              setSelectedID={setSelectedID}
            />
          );
        })}
      </Box>
      <Box id="button-box" className="flex-container">
        <Button onClick={() => setRoomStatus("create-game")}>
          일반 게임 생성
        </Button>
        <Button onClick={() => setRoomStatus("ladder-game")}>
          래더 게임 시작
        </Button>
      </Box>
      <NormalGameModal
        roomStatus={roomStatus}
        setRoomStatus={setRoomStatus}
        selectedID={selectedID}
      />
      <LadderGameModal roomStatus={roomStatus} setRoomStatus={setRoomStatus} />
      <CreateGameModal roomStatus={roomStatus} setRoomStatus={setRoomStatus} />
    </Box>
  );
};

export default Game;
