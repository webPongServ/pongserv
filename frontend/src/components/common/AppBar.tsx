import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChattingDrawerWidth } from "constant";
import { IRootState } from "components/common/store";
import SkeletonMyInfo from "./utils/SkeletonMyInfo";
import "styles/AppHeader.scss";
import "styles/global.scss";

import { Toolbar, IconButton } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import ForumIcon from "@mui/icons-material/Forum";

type HandleOpen = { open: boolean; setOpen: Function };

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const TopBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: ChattingDrawerWidth,
    width: `calc(100% - ${ChattingDrawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: ChattingDrawerWidth,
  }),
}));

const AppBar = (props: HandleOpen) => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);

  const handleDrawerOpen = () => {
    props.setOpen(true);
  };
  return (
    <TopBar id="AppBar" position="fixed" open={props.open}>
      <Toolbar>
        {myInfo.nickname === "" ? (
          <SkeletonMyInfo />
        ) : (
          <Link
            id="my-profile"
            className="flex-container"
            to={`/profile/${myInfo.nickname}`}
          >
            <img src={`${myInfo.imgURL}`} alt="AppBar-profile" />
            {myInfo.nickname}
          </Link>
        )}
        <Link id="logo" to="/game">
          WebPongServ
        </Link>
        <IconButton
          id="chat-button"
          edge="end"
          onClick={handleDrawerOpen}
          sx={{ ...(props.open && { display: "none" }) }}
        >
          <ForumIcon />
        </IconButton>
      </Toolbar>
    </TopBar>
  );
};

export default AppBar;
