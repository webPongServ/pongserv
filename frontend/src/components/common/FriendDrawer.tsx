import { useEffect } from "react";
import { FriendDrawerWidth } from "constant";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { UserDetail } from "types/Detail";
import { FriendStatusType } from "constant";
import EmptyListMessage from "components/utils/EmptyListMessage";
import CustomIconButton from "components/utils/CustomIconButton";
import CustomProfileButton from "components/utils/CustomProfileButton";
import LoadingCircle from "components/utils/LoadingCircle";
import UserService from "API/UserService";
import "styles/AppHeader.scss";
import "styles/global.scss";

import { Box, List, ListItem } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
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

interface serverFriend {
  nickname: string;
  imageUrl: string;
  isCurrStatus: boolean;
}

const FriendDrawer = () => {
  const chattingSocket = useSelector(
    (state: IRootState) => state.sockets.chattingSocket
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // 받아 오기
  const friends: UserDetail[] | null = useSelector(
    (state: IRootState) => state.friends.friends
  );

  const getFriends = async () => {
    const response = await UserService.getFriend();

    // API 호출
    dispatch({
      type: FriendsActionTypes.FRIENDS_GET,
      payload: response.data.map(
        (value: serverFriend): UserDetail => ({
          nickname: value.nickname,
          imgURL: value.imageUrl,
          status: value.isCurrStatus ? "login" : "logout",
        })
      ),
    });
  };

  const socketFriendStatusLogin = (nickname: string) => {
    console.log("frined login", nickname);
    dispatch({
      type: FriendsActionTypes.FRIENDS_UPDATE_STATUS,
      payload: { nickname: nickname, status: "login" },
    });
  };

  const socketFriendStatusLogout = (nickname: string) => {
    console.log("frined logout", nickname);
    dispatch({
      type: FriendsActionTypes.FRIENDS_UPDATE_STATUS,
      payload: { nickname: nickname, status: "logout" },
    });
  };

  useEffect(() => {
    getFriends();
    chattingSocket.on("friendStatusLogin", socketFriendStatusLogin);
    chattingSocket.on("friendStatusLogout", socketFriendStatusLogout);

    return () => {
      chattingSocket.off("friendStatusLogin", socketFriendStatusLogin);
      chattingSocket.on("friendStatusLogout", socketFriendStatusLogout);
    };
  }, []);

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
          <EmptyListMessage message="친구를 추가해 보세요!" />
        )}
        {friends !== null && friends.length !== 0 && (
          <List>
            {friends!
              .filter((friend) => friend.status === FriendStatusType.login)
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
              .filter((friend) => friend.status === FriendStatusType.logout)
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
