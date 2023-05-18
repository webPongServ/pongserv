import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { useNavigate } from "react-router-dom";
import GameReady from "components/game/GameReady";
// 난이도에 따라 paddle의 pixel const 조절하기(js) => constant에서 제거
import { GameBoardConst } from "constant";
import SuccessNotification from "components/utils/SuccessNotification";
import { CurrentGameActionTypes } from "types/redux/CurrentGame";
import { LoginStatusActionTypes } from "types/redux/Login";
import { GameDifficultyType } from "constant";

import { Box } from "@mui/material";

interface GameBoardProps {
  id: string;
}

interface RelativeCoord {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const quadrant = [[], [1, 0], [0, 0], [0, 1], [1, 1]];
// let random = (Math.floor(Math.random() * 10) % 4) + 1;
let random = 2;

const setDifficulty = (difficulty: string): number => {
  if (difficulty === GameDifficultyType.easy) return 3;
  else if (difficulty === GameDifficultyType.normal) return 5;
  else if (difficulty === GameDifficultyType.hard) return 7;
  return 5;
};

const GameBoard = (props: GameBoardProps) => {
  const gameSocket = useSelector(
    (state: IRootState) => state.sockets.gameSocket
  );
  const currentGame = useSelector((state: IRootState) => state.currentGame);
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notiRef = useRef<HTMLDivElement>(null);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(3);
  const [selectedPaddleRef, setSelectedPaddleRef] =
    useState<React.RefObject<HTMLDivElement> | null>(null);
  const [selectedPaddle, setSelectedPaddle] = useState<RelativeCoord | null>(
    null
  );
  let score1: number = 0;
  let score2: number = 0;

  const divRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const paddleRef = useRef<HTMLDivElement>(null);
  const paddle2Ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  let paddle1_rel: RelativeCoord = {
      top: 60,
      bottom: 60 + GameBoardConst.PADDLE_HEIGHT,
      left: 30,
      right: 30 + GameBoardConst.PADDLE_WIDTH,
    },
    paddle2_rel: RelativeCoord = {
      top: 420,
      bottom: 420 + GameBoardConst.PADDLE_HEIGHT,
      left: 950,
      right: 950 + GameBoardConst.PADDLE_WIDTH,
    },
    ball_rel: RelativeCoord = {
      top: 300,
      bottom: 300 + GameBoardConst.BALL_DIAMETER,
      left: 500,
      right: 500 + GameBoardConst.BALL_DIAMETER,
    };
  let dx: number = currentGame.currentGame
    ? setDifficulty(currentGame.currentGame.difficulty)
    : 5;
  let dy: number = currentGame.currentGame
    ? setDifficulty(currentGame.currentGame.difficulty)
    : 5;
  let dxd: number = quadrant[random][0];
  let dyd: number = quadrant[random][1];

  const pressKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (paddleRef.current || paddle2Ref.current) {
      const role: string =
        currentGame.currentGame!.owner === myInfo.nickname ? "owner" : "guest";

      if (event.key === "ArrowUp") {
        selectedPaddleRef!.current!.style.top =
          Math.max(0, selectedPaddle!.top - GameBoardConst.MOVE_PIXEL) + "px";
        selectedPaddle!.top = Math.max(
          0,
          selectedPaddle!.top - GameBoardConst.MOVE_PIXEL
        );
        selectedPaddleRef!.current!.style.bottom =
          selectedPaddle!.top + 150 + "px";
        selectedPaddle!.bottom = selectedPaddle!.top + 150;

        gameSocket.emit(
          "inGameReq",
          {
            roomId: currentGame.currentGame!.id,
            data: { top: selectedPaddle!.top, bottom: selectedPaddle!.bottom },
            role: role,
            type: "paddle",
          },
          () => {}
        );
      }
      if (event.key === "ArrowDown") {
        selectedPaddleRef!.current!.style.top =
          Math.min(
            GameBoardConst.GAMEBOARD_HEIGHT - GameBoardConst.PADDLE_HEIGHT,
            selectedPaddle!.top + GameBoardConst.MOVE_PIXEL
          ) + "px";
        selectedPaddle!.top = Math.min(
          GameBoardConst.GAMEBOARD_HEIGHT - GameBoardConst.PADDLE_HEIGHT,
          selectedPaddle!.top + GameBoardConst.MOVE_PIXEL
        );
        selectedPaddleRef!.current!.style.bottom =
          selectedPaddle!.top + 150 + "px";
        selectedPaddle!.bottom = selectedPaddle!.top + 150;
        gameSocket.emit(
          "inGameReq",
          {
            roomId: currentGame.currentGame!.id,
            data: { top: selectedPaddle!.top, bottom: selectedPaddle!.bottom },
            role: role,
            type: "paddle",
          },
          () => {}
        );
      }
    }
  };

  // useEffect(() => {
  const moveBall = (dx: number, dy: number, dxd: number, dyd: number) => {
    if (ballRef.current) {
      const role: string =
        currentGame.currentGame!.owner === myInfo.nickname ? "owner" : "guest";

      if (ball_rel.top <= 0) dyd = 1;
      if (ball_rel.bottom >= GameBoardConst.GAMEBOARD_HEIGHT) dyd = 0;
      if (
        ball_rel.left <= paddle1_rel.right &&
        ball_rel.top >= paddle1_rel.top &&
        ball_rel.bottom <= paddle1_rel.bottom
      ) {
        // why 10?
        if (ball_rel.left <= 10) {
          console.log(
            currentGame.currentGame!.owner,
            myInfo.nickname,
            currentGame.currentGame!.owner === myInfo.nickname
              ? "owner"
              : "guest"
          );
          score2++;
          ballRef.current!.style.top = "300px";
          ballRef.current!.style.bottom = "315px";
          ballRef.current!.style.left = "500px";
          ballRef.current!.style.right = "515px";
          ball_rel.top = 300;
          ball_rel.bottom = 315;
          ball_rel.left = 500;
          ball_rel.right = 515;
          dispatch({
            type: CurrentGameActionTypes.INCREMENT_SCORE,
            payload: "score2",
          });
          if (score2 === currentGame.currentGame!.maxScore) {
            gameSocket.emit(
              "finishGame",
              {
                roomId: currentGame.currentGame!.id,
                myScore: role === "owner" ? score1 : score2,
                opScore: role === "owner" ? score2 : score1,
              },
              () => {
                random = 2;
                dispatch({
                  type: CurrentGameActionTypes.DELETE_GAMEROOM,
                  payload: "",
                });
                navigate("/game");
              }
            );
            return;
          }
          setTimeout(() => {
            requestAnimationFrame(() => {
              dx = currentGame.currentGame
                ? setDifficulty(currentGame.currentGame.difficulty)
                : 5;
              dy = currentGame.currentGame
                ? setDifficulty(currentGame.currentGame.difficulty)
                : 5;
              random = 2;
              dxd = quadrant[random][0];
              dyd = quadrant[random][1];
              moveBall(dx, dy, dxd, dyd);
            });
          }, 3000);
          return;
        } else dxd = 1;
      }
      if (
        ball_rel.right >= paddle2_rel.left &&
        ball_rel.top >= paddle2_rel.top &&
        ball_rel.bottom <= paddle2_rel.bottom
      ) {
        if (GameBoardConst.GAMEBOARD_WIDTH - ball_rel.right <= 10) {
          console.log(
            currentGame.currentGame!.owner,
            myInfo.nickname,
            currentGame.currentGame!.owner === myInfo.nickname
              ? "owner"
              : "guest"
          );
          score1++;
          ballRef.current!.style.top = "300px";
          ballRef.current!.style.bottom = "315px";
          ballRef.current!.style.left = "500px";
          ballRef.current!.style.right = "515px";
          ball_rel.top = 300;
          ball_rel.bottom = 315;
          ball_rel.left = 500;
          ball_rel.right = 515;
          dispatch({
            type: CurrentGameActionTypes.INCREMENT_SCORE,
            payload: "score1",
          });
          if (score1 === currentGame.currentGame!.maxScore) {
            gameSocket.emit(
              "finishGame",
              {
                roomId: currentGame.currentGame!.id,
                myScore: role === "owner" ? score1 : score2,
                opScore: role === "owner" ? score2 : score1,
              },
              () => {
                random = 2;
                dispatch({
                  type: CurrentGameActionTypes.DELETE_GAMEROOM,
                  payload: "",
                });
                // 결과 페이지로 navigate => 10초간 보여주고 redirect, 버튼 누르면 redirect(초기화)
                window.location.href = "/game";
              }
            );
            return;
          }
          setTimeout(() => {
            requestAnimationFrame(() => {
              dx = currentGame.currentGame
                ? setDifficulty(currentGame.currentGame.difficulty)
                : 5;
              dy = currentGame.currentGame
                ? setDifficulty(currentGame.currentGame.difficulty)
                : 5;
              random = 4;
              dxd = quadrant[random][0];
              dyd = quadrant[random][1];
              moveBall(dx, dy, dxd, dyd);
            });
          }, 3000);
          return;
        } else dxd = 0;
      }
      if (ball_rel.left <= 0 || ball_rel.right >= 1000) {
        console.log(
          currentGame.currentGame!.owner,
          myInfo.nickname,
          currentGame.currentGame!.owner === myInfo.nickname ? "owner" : "guest"
        );
        ballRef.current!.style.top = "300px";
        ballRef.current!.style.bottom = "315px";
        ballRef.current!.style.left = "500px";
        ballRef.current!.style.right = "515px";
        ball_rel.top = 300;
        ball_rel.bottom = 315;
        ball_rel.left = 500;
        ball_rel.right = 515;
        if (ball_rel.left <= 0) {
          score2++;
          dispatch({
            type: CurrentGameActionTypes.INCREMENT_SCORE,
            payload: "score2",
          });
          random = 2;
        } else {
          score1++;
          dispatch({
            type: CurrentGameActionTypes.INCREMENT_SCORE,
            payload: "score1",
          });
          random = 4;
        }
        if (
          score1 === currentGame.currentGame!.maxScore ||
          score2 === currentGame.currentGame!.maxScore
        ) {
          gameSocket.emit(
            "finishGame",
            {
              roomId: currentGame.currentGame!.id,
              myScore: role === "owner" ? score1 : score2,
              opScore: role === "owner" ? score2 : score1,
            },
            () => {
              random = 2;
              dispatch({
                type: CurrentGameActionTypes.DELETE_GAMEROOM,
                payload: "",
              });
              window.location.href = "/game";
            }
          );
          return;
        }
        setTimeout(() => {
          requestAnimationFrame(() => {
            dx = currentGame.currentGame
              ? setDifficulty(currentGame.currentGame.difficulty)
              : 5;
            dy = currentGame.currentGame
              ? setDifficulty(currentGame.currentGame.difficulty)
              : 5;
            dxd = quadrant[random][0];
            dyd = quadrant[random][1];
            moveBall(dx, dy, dxd, dyd);
          });
        }, 3000);
        return;
      }

      ballRef.current!.style.top =
        ball_rel.top + dy * (dyd === 0 ? -1 : 1) + "px";
      ball_rel.top = ball_rel.top + dy * (dyd === 0 ? -1 : 1);
      ballRef.current!.style.bottom = ball_rel.top + 15 + "px";
      ball_rel.bottom = ball_rel.top + 15;
      ballRef.current!.style.left =
        ball_rel.left + dx * (dxd === 0 ? -1 : 1) + "px";
      ball_rel.left = ball_rel.left + dx * (dxd === 0 ? -1 : 1);
      ballRef.current!.style.right = ball_rel.left + 15 + "px";
      ball_rel.right = ball_rel.left + 15;
      gameSocket.emit("inGameReq", {
        roomId: currentGame.currentGame!.id,
        data: {
          top: ball_rel.top,
          bottom: ball_rel.bottom,
          left: ball_rel.left,
          right: ball_rel.right,
        },
        role: role,
        type: "ball",
      });
      setTimeout(() => {
        requestAnimationFrame(() => {
          moveBall(dx, dy, dxd, dyd);
        });
      }, 25);
    }
  };

  const socketGameStart = () => {
    if (notiRef.current) notiRef.current.style.animationName = "slidedown";
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (notiRef.current) notiRef.current.style.animationName = "slideup";
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      setIsWaiting(false);
      dispatch({
        type: LoginStatusActionTypes.STATUS_GAME,
      });
      setTimeout(() => {
        requestAnimationFrame(() => {
          moveBall(dx, dy, dxd, dyd);
        });
      }, 3000);
    }, 4000);
  };

  const socketRoomOwner = () => {
    setSelectedPaddleRef(paddleRef);
    setSelectedPaddle(paddle1_rel);
    console.log("owner!");
  };

  const socketRoomGuest = () => {
    setSelectedPaddleRef(paddle2Ref);
    setSelectedPaddle(paddle2_rel);
    console.log("guest!");
  };

  const socketInGameRes = (data: {
    roomId: string;
    data: any;
    role: string;
    type: string;
  }) => {
    if (data.type === "paddle") {
      if (data.role === "owner") {
        paddleRef.current!.style.top = data.data.top + "px";
        paddle1_rel.top = data.data.top;
        paddleRef.current!.style.bottom = data.data.bottom + "px";
        paddle1_rel.bottom = data.data.bottom;
      } else {
        paddle2Ref.current!.style.top = data.data.top + "px";
        paddle2_rel.top = data.data.top;
        paddle2Ref.current!.style.bottom = data.data.bottom + "px";
        paddle2_rel.bottom = data.data.bottom;
      }
    } else {
      if (data.role === "owner") {
        ballRef.current!.style.left = data.data.left + "px";
        ball_rel.left = data.data.left;
        ballRef.current!.style.right = data.data.right + "px";
        ball_rel.right = data.data.right;
        ballRef.current!.style.top = data.data.top + "px";
        ball_rel.top = data.data.top;
        ballRef.current!.style.bottom = data.data.bottom + "px";
        ball_rel.bottom = data.data.bottom;
      } else {
        ballRef.current!.style.left = data.data.left + "px";
        ball_rel.left = data.data.left;
        ballRef.current!.style.right = data.data.right + "px";
        ball_rel.right = data.data.right;
        ballRef.current!.style.top = data.data.top + "px";
        ball_rel.top = data.data.top;
        ballRef.current!.style.bottom = data.data.bottom + "px";
        ball_rel.bottom = data.data.bottom;
      }
    }
  };

  useEffect(() => {
    const socketEndGame = () => {
      gameSocket.emit(
        "dodge",
        {
          roomId: currentGame.currentGame!.id,
          myScore:
            selectedPaddleRef === paddleRef
              ? currentGame.score1
              : currentGame.score2,
          opScore:
            selectedPaddleRef === paddleRef
              ? currentGame.score2
              : currentGame.score1,
        },
        () => {
          dispatch({
            type: CurrentGameActionTypes.DELETE_GAMEROOM,
            payload: "",
          });
          window.location.href = "/game";
        }
      );
    };

    if (gameSocket) gameSocket.on("endGame", socketEndGame);

    return () => gameSocket.off("endGame", socketEndGame);
  }, [currentGame]);

  useEffect(() => {
    if (divRef.current !== null) divRef.current.focus();
    // 난이도에 따라 paddleRef의 height를 조절하기(css)
    if (gameSocket) {
      gameSocket.on("gameStart", socketGameStart);
      gameSocket.on("roomOwner", socketRoomOwner);
      gameSocket.on("roomGuest", socketRoomGuest);
      gameSocket.on("inGameRes", socketInGameRes);
    }
    return () => {
      gameSocket.off("gameStart", socketGameStart);
      gameSocket.off("roomOwner", socketRoomOwner);
      gameSocket.off("roomGuest", socketRoomGuest);
      gameSocket.off("inGameRes", socketInGameRes);
    };
  }, []);

  useLayoutEffect(() => {
    if (!gameSocket) window.location.href = "/game?error=wrong_game_access";
  }, []);

  return (
    <Box
      id={props.id}
      className="flex-container"
      onKeyDown={pressKey}
      tabIndex={0}
      ref={divRef}
    >
      {isWaiting ? (
        <>
          <SuccessNotification
            successMessage={`${timer}초 후에 게임이 시작됩니다.`}
            ref={notiRef}
          />
          <GameReady
            type="일반 게임"
            content="상대를 기다리는 중"
            funnyImg="funny3.gif"
          />
        </>
      ) : (
        <Box className="board" ref={boardRef}>
          <Box className="ball" ref={ballRef}></Box>
          <Box className="paddle_1 paddle" ref={paddleRef}></Box>
          <Box className="paddle_2 paddle" ref={paddle2Ref}></Box>
          <h1 className="player_1_score">{currentGame!.score1}</h1>
          <h1 className="player_2_score">{currentGame!.score2}</h1>
        </Box>
      )}
    </Box>
  );
};

export default GameBoard;
