import { useState, useEffect, useRef } from "react";
import { GameBoardConst } from "constant";

import { Box } from "@mui/material";

interface GameBoardProps {
  id: string;
}

const quadrant = [[], [1, 0], [0, 0], [0, 1], [1, 1]];
const random = 1;

const GameBoard = (props: GameBoardProps) => {
  const [status, setStatus] = useState<string>("ready");
  const [score1, setScore1] = useState<number>(0);
  const [score2, setScore2] = useState<number>(0);

  const divRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const paddleRef = useRef<HTMLDivElement>(null);
  const paddle2Ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  let paddle_1_coord: DOMRect;
  let paddle_2_coord: DOMRect;
  let board_coord: DOMRect;
  let paddle_relative_coord: number;
  let ball_coord: DOMRect;
  let dx: number = 10;
  let dy: number = 10;
  let dxd: number = quadrant[random][0];
  let dyd: number = quadrant[random][1];

  const pressKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    paddle_1_coord = paddleRef.current!.getBoundingClientRect();
    paddle_2_coord = paddle2Ref.current!.getBoundingClientRect();
    board_coord = boardRef.current!.getBoundingClientRect();
    ball_coord = ballRef.current!.getBoundingClientRect();
    paddle_relative_coord = paddle_1_coord.top - board_coord.top - 5;

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
      if (event.key === "ArrowUp") {
        paddleRef.current!.style.top =
          Math.max(0, paddle_relative_coord - 25) + "px";
        paddle_1_coord = paddleRef.current!.getBoundingClientRect();
      }
      if (event.key === "ArrowDown") {
        paddleRef.current!.style.top =
          Math.min(
            GameBoardConst.GAMEBOARD_HEIGHT - GameBoardConst.PADDLE_HEIGHT,
            paddle_relative_coord + 25
          ) + "px";
        paddle_1_coord = paddleRef.current!.getBoundingClientRect();
      }
    }
  };

  function moveBall(dx: number, dy: number, dxd: number, dyd: number) {
    paddle_1_coord = paddleRef.current!.getBoundingClientRect();
    paddle_2_coord = paddle2Ref.current!.getBoundingClientRect();
    board_coord = boardRef.current!.getBoundingClientRect();
    ball_coord = ballRef.current!.getBoundingClientRect();

    if (ball_coord.top - board_coord.top <= 0) {
      dyd = 1;
    }
    if (
      ball_coord.bottom - board_coord.top >=
      GameBoardConst.GAMEBOARD_HEIGHT
    ) {
      dyd = 0;
    }
    if (
      ball_coord.left <= paddle_1_coord.right &&
      ball_coord.top >= paddle_1_coord.top &&
      ball_coord.bottom <= paddle_1_coord.bottom
    ) {
      // why?
      if (ball_coord.left - paddle_1_coord.left <= -10) {
        setScore2((prev) => score2 + 1);
        setStatus("ready");
        ballRef.current!.style.top = "285px";
        ballRef.current!.style.left = "485px";
        return;
      } else dxd = 1;
    }
    if (
      ball_coord.right >= paddle_2_coord.left &&
      ball_coord.top >= paddle_2_coord.top &&
      ball_coord.bottom <= paddle_2_coord.bottom
    ) {
      if (ball_coord.left - paddle_2_coord.left <= -10) {
        setScore1((prev) => score1 + 1);
        setStatus("ready");
        ballRef.current!.style.top = "285px";
        ballRef.current!.style.left = "485px";
        return;
      } else dxd = 0;
    }
    if (
      ball_coord.left <= board_coord.left ||
      ball_coord.right >= board_coord.right
    ) {
      if (ball_coord.left <= board_coord.left) {
        setScore2((prev) => score2 + 1);
      } else {
        setScore1((prev) => score1 + 1);
      }
      setStatus("ready");
      ballRef.current!.style.top = "285px";
      ballRef.current!.style.left = "485px";
      return;
    }
    ballRef.current!.style.top =
      ball_coord.top - board_coord.top + dy * (dyd === 0 ? -1 : 0) + "px";
    ballRef.current!.style.left =
      ball_coord.left - board_coord.left + dx * (dxd === 0 ? -1 : 0) + "px";
    // ball_coord = ballRef.current!.getBoundingClientRect();
    requestAnimationFrame(() => {
      moveBall(dx, dy, dxd, dyd);
    });
  }

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
        <Box className="ball" ref={ballRef}>
          {/* <Box className="ball_effect"></Box> */}
        </Box>
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
