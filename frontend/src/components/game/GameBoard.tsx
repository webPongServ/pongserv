import { useState, useEffect, useRef } from "react";
import { GameBoardConst } from "constant";

import { Box } from "@mui/material";

interface GameBoardProps {
  id: string;
}

const GameBoard = (props: GameBoardProps) => {
  const [status, setStatus] = useState<string>("ready");
  const divRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const paddleRef = useRef<HTMLDivElement>(null);

  const pressKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let paddle_1_coord = paddleRef.current!.getBoundingClientRect();
    let board_coord = boardRef.current!.getBoundingClientRect();
    let paddle_relative_coord = paddle_1_coord.top - board_coord.top - 5;

    if (event.key === "Enter") setStatus("start");
    else if (status === "start") {
      if (event.key === "ArrowUp") {
        console.log(paddle_relative_coord);
        paddleRef.current!.style.top =
          Math.max(0, paddle_relative_coord - 25) + "px";
        paddle_1_coord = paddleRef.current!.getBoundingClientRect();
      }
      if (event.key === "ArrowDown") {
        console.log(paddle_relative_coord);
        paddleRef.current!.style.top =
          Math.min(
            GameBoardConst.GAMEBOARD_HEIGHT - GameBoardConst.PADDLE_HEIGHT,
            paddle_relative_coord + 25
          ) + "px";
        paddle_1_coord = paddleRef.current!.getBoundingClientRect();
      }
    }
  };

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
        <Box className="ball">
          <Box className="ball_effect"></Box>
        </Box>
        <Box className="paddle_1 paddle" ref={paddleRef}></Box>
        <Box className="paddle_2 paddle"></Box>
        <h1 className="player_1_score">0</h1>
        <h1 className="player_2_score">0</h1>
        {status === "ready" ? (
          <h1 className="message">Press Enter to Play Pong</h1>
        ) : null}
      </Box>
    </Box>
  );
};

export default GameBoard;
