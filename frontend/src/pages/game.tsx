import { useEffect, useLayoutEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { apiURL } from "API/api";
import { IRootState } from "components/common/store";
import GameCard from "components/game/GameCard";
import NormalGameModal from "components/game/NormalGameModal";
import LadderGameModal from "components/game/LadderGameModal";
import CreateGameModal from "components/game/CreateGameModal";
import EmptyListMessage from "components/utils/EmptyListMessage";
import { useDispatch } from "react-redux";
import { SocketsActionTypes } from "types/redux/Sockets";
import ErrorNotification from "components/utils/ErrorNotification";
import CustomIconButton from "components/utils/CustomIconButton";
import { CurrentGameActionTypes } from "types/redux/CurrentGame";
import GameService from "API/GameService";
import { GameRoomDetail } from "types/Detail";
import { LoginStatusActionTypes } from "types/redux/Login";
import LoadingCircle from "components/utils/LoadingCircle";

import "styles/global.scss";
import "styles/Game.scss";

import { Box, Pagination } from "@mui/material";
import { Button } from "@mui/joy";
import SyncIcon from "@mui/icons-material/Sync";

interface serverGameRoomDetail {
  id: string;
  gmRmNm: string;
  trgtScr: number;
  lvDfct: string;
  owner: string;
  ownerImage: string;
}

const Game = () => {
  const gameSocket = useSelector(
    (state: IRootState) => state.sockets.gameSocket
  );
  const [gameRooms, setGameRooms] = useState<GameRoomDetail[] | null>(null);
  const [roomStatus, setRoomStatus] = useState<string>("game");
  const [selectedRoom, setSelectedRoom] = useState<GameRoomDetail | null>(null);
  const [page, setPage] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useDispatch();
  const notiRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery(
    ["gameRooms"],
    async () => {
      const response = await GameService.getGameRooms();
      return response.data;
    },
    {
      staleTime: 5000, // 5초
      cacheTime: Infinity, // 제한 없음
    }
  );

  dispatch({
    type: LoginStatusActionTypes.STATUS_MAIN,
  });

  const getGameRooms = async () => {
    setGameRooms(null);
    const response = await GameService.getGameRooms();
    console.log(response.data);
    setGameRooms(
      response.data.map((value: serverGameRoomDetail): any => ({
        id: value.id,
        title: value.gmRmNm,
        owner: value.owner,
        maxScore: value.trgtScr,
        difficulty: value.lvDfct,
        ownerImage: value.ownerImage,
      }))
    );
  };

  const socketException = (response: string) => {
    setErrorMessage(response);
  };

  useLayoutEffect(() => {
    if (!gameSocket) {
      const token = localStorage.getItem("accessToken");
      const gameSocket = io(`${apiURL}/games`, {
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch({
        type: SocketsActionTypes.GAMESOCKET_UPDATE,
        payload: gameSocket,
      });
      gameSocket.on("exception", socketException);

      return () => {
        gameSocket.off("exception", socketException);
      };
    }
  }, [gameSocket]);

  useEffect(() => {
    getGameRooms();
    dispatch({ type: CurrentGameActionTypes.DELETE_GAMEROOM, payload: "" });
  }, []);

  return (
    <Box id="GameWaiting" className="flex-container">
      {/* <ErrorNotification ref={notiRef} errorMessage={errorMessage} /> */}
      <Box id="game-box">
        <Box className="list flex-wrap-container">
          {gameRooms === null && <LoadingCircle />}
          {gameRooms !== null && gameRooms.length === 0 && (
            <EmptyListMessage message="게임방이 존재하지 않습니다!" />
          )}
          {gameRooms !== null &&
            gameRooms.length !== 0 &&
            gameRooms.map((value, index) =>
              4 * (page - 1) <= index && index < 4 * page ? (
                <GameCard
                  key={value.id + index}
                  gameDetail={{
                    id: value.id,
                    title: value.title,
                    owner: value.owner,
                    ownerImage: value.ownerImage,
                    maxScore: value.maxScore,
                    difficulty: value.difficulty,
                  }}
                  setRoomStatus={setRoomStatus}
                  setSelectedRoom={setSelectedRoom}
                />
              ) : null
            )}
        </Box>
        <Box className="pagination flex-container">
          <Pagination
            count={
              gameRooms === null || gameRooms.length === 0
                ? 1
                : Math.ceil(gameRooms.length / 4)
            }
            variant="outlined"
            shape="rounded"
            onChange={(e, number) => {
              setPage(number);
            }}
          />
        </Box>
      </Box>
      <Box id="button-box" className="flex-container">
        <Button
          className="game-button"
          onClick={() => setRoomStatus("create-game")}
        >
          일반 게임 생성
        </Button>
        <Button
          className="game-button"
          onClick={() => setRoomStatus("ladder-game")}
        >
          래더 게임 시작
        </Button>
        <CustomIconButton
          class=""
          icon={<SyncIcon />}
          handleFunction={getGameRooms}
        />
      </Box>
      <NormalGameModal
        roomStatus={roomStatus}
        setRoomStatus={setRoomStatus}
        selectedRoom={selectedRoom}
      />
      <LadderGameModal roomStatus={roomStatus} setRoomStatus={setRoomStatus} />
      <CreateGameModal roomStatus={roomStatus} setRoomStatus={setRoomStatus} />
    </Box>
  );
};

export default Game;
