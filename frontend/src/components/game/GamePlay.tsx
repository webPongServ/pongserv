import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IRootState } from "components/common/store";
import GameBoard from "components/game/GameBoard";
import SkeletonMyInfo from "components/common/utils/SkeletonMyInfo";
import "styles/global.scss";
import "styles/Game.scss";

import { Box, CssBaseline, Toolbar, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import ForumIcon from "@mui/icons-material/Forum";

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
        <TopBar id="AppBar" position="fixed">
          <Toolbar>
            {myInfo.nickname === "" ? (
              <SkeletonMyInfo />
            ) : (
              <Box id="my-profile" className="flex-container">
                <img src={`${myInfo.imgURL}`} alt="AppBar-profile" />
                {myInfo.nickname}
              </Box>
            )}
            <Link id="logo" to="/game">
              WebPongServ
            </Link>
            <IconButton id="chat-button" edge="end" disabled>
              <ForumIcon className="disabled" />
            </IconButton>
          </Toolbar>
        </TopBar>
      </Box>
      <GameBoard id="board" />
    </Box>
  );
};

export default GamePlay;
