import { FriendDrawerWidth } from "constant";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IRootState } from "components/common/store";
import EmptyListMessage from "components/common/utils/EmptyListMessage";
import CustomIconButton from "components/common/utils/CustomIconButton";
import CustomProfileButton from "components/common/utils/CustomProfileButton";
import "styles/AppHeader.scss";
import "styles/global.scss";

import { Box, List, ListItem } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

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
  // 받아 오기
  const friends = useSelector((state: IRootState) => state.friends.friends);

  return (
    <Drawer id="FriendDrawer" variant="permanent" open={true}>
      <DrawerHeader id="padding" />
      <Box id="header" className="flex-container">
        <Box className="fixed-center">친구 목록</Box>
        <CustomIconButton
          class=""
          icon={<SearchIcon />}
          handleFunction={() => {
            navigate(`/search`);
          }}
        />
      </Box>
      <Box id="body" className="overflow">
        {friends.length === 0 ? (
          <EmptyListMessage message="친구인 사용자가 없습니다!" />
        ) : (
          <List>
            {friends
              .filter((friend) => friend.status === "login")
              .map((value, index) => (
                <ListItem key={value.nickname + index} disablePadding>
                  <CustomProfileButton
                    class="login"
                    nickname={value.nickname}
                    imgURL={value.imgURL}
                    position="FriendDrawer"
                    handleFunction={() => {
                      navigate(`/profile/${value.nickname}`);
                    }}
                  />
                </ListItem>
              ))}
            {friends
              .filter((friend) => friend.status === "logout")
              .map((value, index) => (
                <ListItem key={value.nickname + index} disablePadding>
                  <CustomProfileButton
                    class="logout"
                    nickname={value.nickname}
                    imgURL={value.imgURL}
                    position="FriendDrawer"
                    handleFunction={() => {
                      navigate(`/profile/${value.nickname}`);
                    }}
                  />
                </ListItem>
              ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default FriendDrawer;
