import { useState } from "react";
import io from "socket.io-client";
import { apiURL } from "API/api";
import GameCard from "components/game/GameCard";
import NormalGameModal from "components/game/NormalGameModal";
import LadderGameModal from "components/game/LadderGameModal";
import CreateGameModal from "components/game/CreateGameModal";
import EmptyListMessage from "components/utils/EmptyListMessage";
import { useSelector, useDispatch } from "react-redux";
import { SocketsActionTypes } from "types/redux/Sockets";

import { IRootState } from "components/common/store";
import "styles/global.scss";
import "styles/Game.scss";

import { Box, Pagination } from "@mui/material";
import { Button } from "@mui/joy";

const Game = () => {
  const gameRooms = useSelector(
    (state: IRootState) => state.gameRooms.gameRooms
  );
  const [roomStatus, setRoomStatus] = useState<string>("game");
  const [selectedID, setSelectedID] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();

  const token = localStorage.getItem("accessToken");
  const gameSocket = io(apiURL, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  dispatch({
    type: SocketsActionTypes.GAMESOCKET_UPDATE,
    payload: gameSocket,
  });

  console.log("game socket : ", gameSocket);

  return (
    <Box id="GameWaiting" className="flex-container">
      <Box id="game-box">
        <Box className="list flex-wrap-container">
          {gameRooms.length === 0 ? (
            <EmptyListMessage message="게임방이 존재하지 않습니다!" />
          ) : (
            gameRooms.map((value, index) =>
              4 * (page - 1) <= index && index < 4 * page ? (
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
              ) : null
            )
          )}
        </Box>
      </Box>
      <Box className="pagination flex-container">
        <Pagination
          count={Math.floor(gameRooms.length / 4) + 1}
          variant="outlined"
          shape="rounded"
          onChange={(e, number) => {
            setPage(number);
          }}
        />
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
