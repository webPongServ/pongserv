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
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton } from "@mui/material";

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: FriendDrawerWidth,
  height: "100%",
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
  console.log(setLoginFriends, setLogoutFriends);

  return (
    <Drawer variant="permanent" open={true}>
      <DrawerHeader sx={{ height: "10%" }} />
      <Box className="flex-container" sx={{ height: "3%", gap: 5 }}>
        <Box style={{ fontSize: "20px", marginLeft: "30%" }}>친구 목록</Box>
        <IconButton
          sx={{ backgroundColor: "skyblue", borderRadius: "10px" }}
          onClick={() => {
            navigate(`/search`);
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      <List sx={{ height: "80%", overflow: "auto" }}>
        {loginFriends.map((value, index) => (
          <ListItem
            key={value + index}
            disablePadding
            sx={{ display: "block" }}
          >
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
              <ListItemText primary={value} sx={{ opacity: true ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
        {logoutFriends.map((value, index) => (
          <ListItem
            key={value + index}
            disablePadding
            sx={{ display: "block" }}
          >
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
                <AccountCircleIcon fontSize="large" sx={{ color: "#cccccc" }} />
              </ListItemIcon>
              <ListItemText
                primary={value}
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
