import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { socket } from "socket";
import Login from "pages/login";
import Home from "pages/index";
import Redirect from "pages/Redirect";
import AppHeader from "components/common/AppHeader";
import GamePlay from "components/game/GamePlay";
import "styles/global.scss";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  // if (!isConnected) alert("서버와의 접속이 해제되었습니다.");

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
