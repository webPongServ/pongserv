import { useState } from "react";
import { FriendDrawerWidth } from "constant";
import { useNavigate } from "react-router-dom";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Theme, CSSObject } from "@mui/material/styles";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: FriendDrawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const openedMixin = (theme: Theme): CSSObject => ({
  width: FriendDrawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const FriendDrawer = () => {
  const navigate = useNavigate();
  const [loginFriends, setLoginFriends] = useState<string[]>([
    "mgo",
    "seongtki",
    "chanhyle",
    "seongyle",
  ]);
  const [logoutFriends, setLogoutFriends] = useState<string[]>(["noname_12"]);
  console.log(setLoginFriends);
  console.log(setLogoutFriends);

  return (
    <Drawer variant="permanent" open={true}>
      <DrawerHeader />
      <div style={{ fontSize: "20px" }}>친구 목록</div>
      <List>
        {loginFriends.map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: true ? "initial" : "center",
                px: 2.5,
              }}
              onClick={() => {
                navigate(`/profile/${index}`);
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: true ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <AccountCircleIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: true ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
        {logoutFriends.map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: true ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: true ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <AccountCircleIcon fontSize="large" sx={{ color: "#cccccc" }} />
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={{ opacity: true ? 1 : 0, color: "#cccccc" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default FriendDrawer;
