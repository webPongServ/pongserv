import { useState } from "react";
import GameCard from "components/game/GameCard";
import NormalGameModal from "components/game/NormalGameModal";
import LadderGameModal from "components/game/LadderGameModal";
import CreateGameModal from "components/game/CreateGameModal";
import { useSelector } from "react-redux";
import { IRootState } from "components/common/store";

import { Box } from "@mui/system";
import { Button } from "@mui/joy";
import "styles/global.scss";
import "styles/Game.scss";

const Game = () => {
  const [roomStatus, setRoomStatus] = useState<string>("game");
  const [selectedID, setSelectedID] = useState<string>("");
  const gameRooms = useSelector(
    (state: IRootState) => state.gameRooms.gameRooms
  );

  return (
    <>
      <Box
        className="flex-wrap-container overflow"
        sx={{ height: "80%", p: 3, gap: 3 }}
      >
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
      <Box
        className="flex-container direction-column game-button-group"
        sx={{ height: "20%" }}
      >
        <Button
          className="large-size"
          onClick={() => setRoomStatus("create-game")}
        >
          일반 게임 생성
        </Button>
        <Button
          className="large-size"
          onClick={() => setRoomStatus("ladder-game")}
        >
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
    </>
  );
};

export default Game;
