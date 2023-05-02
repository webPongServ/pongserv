import { useState } from "react";
import GameWaiting from "components/game/GameWaiting";

const GameRoom = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(true);

  console.log(setIsWaiting);

  return isWaiting ? (
    <GameWaiting
      type="일반 게임"
      content="상대를 기다리는 중"
      funnyImg="funny3.gif"
    />
  ) : null;
};

export default GameRoom;
