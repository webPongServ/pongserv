import { Routes, Route } from "react-router-dom";
import Profile from "pages/Profile";
import Search from "pages/Search";
import Game from "pages/game";
import GameReady from "components/game/GameReady";
import GameBoard from "components/game/GameBoard";

const MainRoute = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/profile/:nickname" element={<Profile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/game" element={<Game />} />
      <Route path="/game/:id" element={<GameBoard id="board" />} />

      <Route
        path="/game-ladder"
        element={
          <GameReady
            type="래더 게임"
            content="적절한 상대를 찾는 중"
            funnyImg="funny4.gif"
          />
        }
      />
    </Routes>
  );
};

export default MainRoute;
