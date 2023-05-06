import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IRootState } from "components/common/store";
import GameBoard from "./GameBoard";
import "styles/global.scss";
import "styles/Game.scss";

import { Box, CssBaseline, Toolbar } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const TopBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  width: "100%",
  position: "relative",
}));

const GamePlay = () => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);

  return (
    <Box id="GamePlay">
      <Box id="app-bar">
        <CssBaseline />
        <TopBar id="AppBar">
          <Toolbar>
            <Link id="logo" to="/game" className="fixed-center">
              WebPongServ
            </Link>
            <Link
              id="my-profile"
              to={`/profile/${myInfo.nickname}`}
              className="flex-container"
            >
              <img src={`/profile/${myInfo.imgURL}`} alt="AppBar-profile" />
              {myInfo.nickname}
            </Link>
          </Toolbar>
        </TopBar>
      </Box>
      <GameBoard id="board" />
    </Box>
  );
};

export default GamePlay;
