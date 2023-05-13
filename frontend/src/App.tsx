import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "pages/login";
import Home from "pages/index";
import Redirect from "pages/Redirect";
import AppHeader from "components/common/AppHeader";
import GamePlay from "components/game/GamePlay";
import "styles/global.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/game/:id" element={<GamePlay />} />
        <Route path="/*" element={<AppHeader />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
