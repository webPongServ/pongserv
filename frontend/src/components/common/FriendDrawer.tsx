import { FriendDrawerWidth } from "constant";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { UserDetail } from "types/Detail";
import EmptyListMessage from "components/common/utils/EmptyListMessage";
import CustomIconButton from "components/common/utils/CustomIconButton";
import CustomProfileButton from "components/common/utils/CustomProfileButton";
import LoadingCircle from "components/common/utils/LoadingCircle";
import "styles/AppHeader.scss";
import "styles/global.scss";

import { Box, List, ListItem } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from "react";
import { FriendsActionTypes } from "types/redux/Friends";

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
  const dispatch = useDispatch();
  // 받아 오기
  const friends: UserDetail[] | null = useSelector(
    (state: IRootState) => state.friends.friends
  );

  useEffect(() => {
    // API 호출
    dispatch({
      type: FriendsActionTypes.FRIENDS_GET,
      payload: [
        { nickname: "chanhyle", imgURL: "../image.png", status: "login" },
        { nickname: "seongtki", imgURL: "../image.png", status: "login" },
        { nickname: "mgo", imgURL: "../image.png", status: "login" },
        { nickname: "noname_12", imgURL: "../image.png", status: "logout" },
      ],
    });
  }, [dispatch]);

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
        {friends === null && <LoadingCircle />}
        {friends !== null && friends.length === 0 && (
          <EmptyListMessage message="친구인 사용자가 없습니다!" />
        )}
        {friends !== null && friends.length !== 0 && (
          <List>
            {friends!
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
