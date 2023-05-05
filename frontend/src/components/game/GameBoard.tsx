import { useState, useEffect, useRef } from "react";
import { GameBoardConst } from "constant";

import { Box } from "@mui/material";

interface GameBoardProps {
  id: string;
}

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
  let initial_ball_coord: DOMRect;
  let dx: number = 5;
  let dy: number = 5;
  let dxd: number = Math.floor(Math.random() * 2);
  let dyd: number = Math.floor(Math.random() * 2);

  const pressKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    paddle_1_coord = paddleRef.current!.getBoundingClientRect();
    board_coord = boardRef.current!.getBoundingClientRect();
    paddle_relative_coord = paddle_1_coord.top - board_coord.top - 5;

    if (event.key === "Enter") {
      setStatus("play");
      requestAnimationFrame(() => {
        dx = 5;
        dy = 5;
        dxd = Math.floor(Math.random() * 2);
        dyd = Math.floor(Math.random() * 2);
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
    ball_coord = ballRef.current!.getBoundingClientRect();
    paddle_2_coord = paddle2Ref.current!.getBoundingClientRect();

    if (ball_coord.top <= board_coord.top) {
      console.log(1);
      dyd = 1;
    }
    if (ball_coord.top - board_coord.top >= GameBoardConst.GAMEBOARD_HEIGHT) {
      console.log(2);
      dyd = 0;
    }
    if (
      ball_coord.left <= paddle_1_coord.right &&
      ball_coord.top >= paddle_1_coord.top &&
      ball_coord.bottom <= paddle_1_coord.bottom
    ) {
      console.log(3);
      dxd = 1;
      dx = 5;
      dy = 5;
    }
    if (
      ball_coord.right >= paddle_2_coord.left &&
      ball_coord.top >= paddle_2_coord.top &&
      ball_coord.bottom <= paddle_2_coord.bottom
    ) {
      console.log(4);
      dxd = 0;
      dx = 5;
      dy = 5;
    }
    if (
      ball_coord.left <= board_coord.left ||
      ball_coord.right >= board_coord.right
    ) {
      console.log(5);
      if (ball_coord.left <= board_coord.left) {
        setScore2((prev) => score2 + 1);
      } else {
        setScore1((prev) => score1 + 1);
      }
      setStatus("ready");
      // ball_coord = initial_ball_coord;
      ballRef.current!.style.top = "285px";
      ballRef.current!.style.left = "485px";
      // message.innerHTML = "Press Enter to Play Pong";
      // message.style.left = 38 + "vw";
      return;
    }
    // console.log(6); // 벽에 닿아서 튕기는 부분
    console.log(ballRef.current!.style.top, ballRef.current!.style.left);
    // console.log(
    //   ballRef.current!.getBoundingClientRect().top,
    //   ballRef.current!.getBoundingClientRect().left
    // );
    ballRef.current!.style.top =
      ball_coord.top - board_coord.top + dy * (dyd === 0 ? -1 : 1) + "px";
    ballRef.current!.style.left =
      ball_coord.left - board_coord.left + dx * (dxd === 0 ? -1 : 1) + "px";

    console.log(ballRef.current!.style.top, ballRef.current!.style.left);
    // console.log(
    //   ballRef.current!.getBoundingClientRect().top,
    //   ballRef.current!.getBoundingClientRect().left
    // );
    ball_coord = ballRef.current!.getBoundingClientRect();
    requestAnimationFrame(() => {
      moveBall(dx, dy, dxd, dyd);
    });
  }

  useEffect(() => {
    if (divRef.current !== null) divRef.current.focus();
    // initial_ball_coord = ballRef.current!.getBoundingClientRect();
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
