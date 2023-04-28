import { Routes, Route } from "react-router-dom";
import Main from "pages/main";
import Profile from "pages/Profile";
import Search from "pages/Search";
import Game from "pages/game";
import GameRoom from "components/game/GameRoom";
import GameWaiting from "components/game/GameWaiting";

const MainRoute = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/profile/:nickname" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/game" element={<Game />} />
        <Route path="/game/:id" element={<GameRoom />} />
        <Route
          path="/game/ladder"
          element={
            <GameWaiting
              type="래더 게임"
              content="적절한 상대를 찾는 중"
              funnyImg="funny4.gif"
            />
          }
        />
      </Routes>
    </>
  );
};

export default MainRoute;
