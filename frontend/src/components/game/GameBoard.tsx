import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "components/common/store";
import { GameBoardConst } from "constant";

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
const random = 4;

const getPaddleRel = (
  paddle_abs: DOMRect,
  board_abs: DOMRect
): RelativeCoord => ({
  left: paddle_abs.left - board_abs.left - GameBoardConst.GAMEBOARD_BORDER,
  right:
    paddle_abs.left -
    board_abs.left -
    GameBoardConst.GAMEBOARD_BORDER +
    GameBoardConst.PADDLE_WIDTH,
  top: paddle_abs.top - board_abs.top - GameBoardConst.GAMEBOARD_BORDER,
  bottom:
    paddle_abs.top -
    board_abs.top -
    GameBoardConst.GAMEBOARD_BORDER +
    GameBoardConst.PADDLE_HEIGHT,
});

const getBallRel = (ball_abs: DOMRect, board_abs: DOMRect): RelativeCoord => ({
  left: ball_abs.left - board_abs.left,
  right: ball_abs.left - board_abs.left + GameBoardConst.BALL_DIAMETER,
  top: ball_abs.top - board_abs.top,
  bottom: ball_abs.top - board_abs.top + GameBoardConst.BALL_DIAMETER,
});

const GameBoard = (props: GameBoardProps) => {
  const gameSocket = useSelector(
    (state: IRootState) => state.sockets.gameSocket
  );
  const [status, setStatus] = useState<string>("ready");
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  const divRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const paddleRef = useRef<HTMLDivElement>(null);
  const paddle2Ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  let paddle1_abs, paddle2_abs, board_abs, ball_abs: DOMRect;
  let paddle1_rel, paddle2_rel, ball_rel: RelativeCoord;
  let dx: number = 10;
  let dy: number = 10;
  let dxd: number = quadrant[random][0];
  let dyd: number = quadrant[random][1];

  const pressKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    paddle1_abs = paddleRef.current!.getBoundingClientRect();
    paddle2_abs = paddle2Ref.current!.getBoundingClientRect();
    board_abs = boardRef.current!.getBoundingClientRect();
    ball_abs = ballRef.current!.getBoundingClientRect();
    paddle1_rel = getPaddleRel(paddle1_abs, board_abs);
    paddle2_rel = getPaddleRel(paddle2_abs, board_abs);
    ball_rel = getBallRel(ball_abs, board_abs);

    if (event.key === "Enter") {
      setStatus("play");
      requestAnimationFrame(() => {
        dx = 10;
        dy = 10;
        dxd = quadrant[random][0];
        dyd = quadrant[random][1];
        moveBall(dx, dy, dxd, dyd);
      });
    } else if (status === "play") {
      if (event.key === "w" || event.key === "ㅈ") {
        paddleRef.current!.style.top =
          Math.max(0, paddle1_rel.top - GameBoardConst.MOVE_PIXEL) + "px";
        paddle1_abs = paddleRef.current!.getBoundingClientRect();
      }
      if (event.key === "s" || event.key === "ㄴ") {
        paddleRef.current!.style.top =
          Math.min(
            GameBoardConst.GAMEBOARD_HEIGHT - GameBoardConst.PADDLE_HEIGHT,
            paddle1_rel.top + GameBoardConst.MOVE_PIXEL
          ) + "px";
        paddle1_abs = paddleRef.current!.getBoundingClientRect();
      }
      if (event.key === "ArrowUp") {
        paddle2Ref.current!.style.top =
          Math.max(0, paddle2_rel.top - GameBoardConst.MOVE_PIXEL) + "px";
        paddle2_abs = paddle2Ref.current!.getBoundingClientRect();
      }
      if (event.key === "ArrowDown") {
        paddle2Ref.current!.style.top =
          Math.min(
            GameBoardConst.GAMEBOARD_HEIGHT - GameBoardConst.PADDLE_HEIGHT,
            paddle2_rel.top + GameBoardConst.MOVE_PIXEL
          ) + "px";
        paddle2_abs = paddle2Ref.current!.getBoundingClientRect();
      }
    }
  };

  function moveBall(dx: number, dy: number, dxd: number, dyd: number) {
    paddle1_abs = paddleRef.current!.getBoundingClientRect();
    paddle2_abs = paddle2Ref.current!.getBoundingClientRect();
    board_abs = boardRef.current!.getBoundingClientRect();
    ball_abs = ballRef.current!.getBoundingClientRect();
    paddle1_rel = getPaddleRel(paddle1_abs, board_abs);
    paddle2_rel = getPaddleRel(paddle2_abs, board_abs);
    ball_rel = getBallRel(ball_abs, board_abs);

    if (ball_rel.top <= 0) dyd = 1;
    if (ball_rel.bottom >= GameBoardConst.GAMEBOARD_HEIGHT) dyd = 0;
    if (
      ball_rel.left <= paddle1_rel.right &&
      ball_rel.top >= paddle1_rel.top &&
      ball_rel.bottom <= paddle1_rel.bottom
    ) {
      // why 10?
      if (ball_rel.left <= 10) {
        setScore2((prev) => score2 + 1);
        setStatus("ready");
        ballRef.current!.style.top = "285px";
        ballRef.current!.style.left = "485px";
        return;
      } else dxd = 1;
    }
    if (
      ball_rel.right >= paddle2_rel.left &&
      ball_rel.top >= paddle2_rel.top &&
      ball_rel.bottom <= paddle2_rel.bottom
    ) {
      if (GameBoardConst.GAMEBOARD_WIDTH - ball_rel.right <= 10) {
        setScore1((prev) => score1 + 1);
        setStatus("ready");
        ballRef.current!.style.top = "285px";
        ballRef.current!.style.left = "485px";
        return;
      } else dxd = 0;
    }
    if (ball_abs.left <= board_abs.left || ball_abs.right >= board_abs.right) {
      if (ball_abs.left <= board_abs.left) setScore2((prev) => score2 + 1);
      else setScore1((prev) => score1 + 1);
      setStatus("ready");
      ballRef.current!.style.top = "285px";
      ballRef.current!.style.left = "485px";
      return;
    }
    ballRef.current!.style.top =
      ball_abs.top - board_abs.top + dy * (dyd === 0 ? -1 : 0) + "px";
    ballRef.current!.style.left =
      ball_abs.left - board_abs.left + dx * (dxd === 0 ? -1 : 0) + "px";
    // ball_abs = ballRef.current!.getBoundingClientRect();
    requestAnimationFrame(() => {
      moveBall(dx, dy, dxd, dyd);
    });
  }

  useLayoutEffect(() => {
    if (!gameSocket) window.location.href = "/game?error=wrong_access_game";
  }, []);

  useEffect(() => {
    if (divRef.current !== null) divRef.current.focus();
  }, []);

  return (
    <Box
      id={props.id}
      className="flex-container"
      onKeyDown={pressKey}
      tabIndex={0}
      ref={divRef}
    >
      <Box className="board" ref={boardRef}>
        <Box className="ball" ref={ballRef}></Box>
        <Box className="paddle_1 paddle" ref={paddleRef}></Box>
        <Box className="paddle_2 paddle" ref={paddle2Ref}></Box>
        <h1 className="player_1_score">{score1}</h1>
        <h1 className="player_2_score">{score2}</h1>
        {status === "ready" ? (
          <h1 className="message">Press Enter to Play Pong</h1>
        ) : null}
      </Box>
    </Box>
  );
};

export default GameBoard;
