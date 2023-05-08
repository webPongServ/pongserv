import { useState } from "react";
import GameReady from "components/game/GameReady";

const GameRoom = () => {
  // 게임 정보 받아오기 => 2명이면 setIsWaiting(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(true);

  return isWaiting ? (
    <GameReady
      type="일반 게임"
      content="상대를 기다리는 중"
      funnyImg="funny3.gif"
    />
  ) : null;
};

export default GameRoom;
