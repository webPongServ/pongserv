import { Link } from "react-router-dom";
import "styles/AppHeader.scss";
import "styles/global.scss";
import { ChattingDrawerWidth } from "constant";

import Toolbar from "@mui/material/Toolbar";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

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
  const handleDrawerOpen = () => {
    props.setOpen(true);
  };
  return (
    <TopBar position="fixed" open={props.open}>
      <Toolbar>
        <Link to="/game" className=" app-bar-container app-bar-link">
          <Typography variant="h6" component="h1" align="center">
            WebPongServ
          </Typography>
        </Link>
        <div className="app-bar-container">
          <Link
            to={`/profile/0`}
            className="app-bar-image flex-container app-bar-link"
          >
            <img src="../image.png" alt="profile_image" />
            <Typography align="center" className="app-bar-center font">
              susong
            </Typography>
          </Link>
        </div>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerOpen}
          sx={{ ...(props.open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </TopBar>
  );
};

export default AppBar;
