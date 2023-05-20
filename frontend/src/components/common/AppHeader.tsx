import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import qs from "query-string";
import MainRoute from "components/common/MainRoute";
import AppBar from "components/common/AppBar";
import FriendDrawer from "components/common/FriendDrawer";
import ChattingDrawer from "components/common/ChattingDrawer";
import ErrorNotification from "components/utils/ErrorNotification";
import { ChattingDrawerWidth } from "constant";
import { useDispatch, useSelector } from "react-redux";
import { apiURL } from "API/api";
import instance from "API/api";
import UserService from "API/UserService";
import { MyInfoActionTypes } from "types/redux/MyInfo";
import { SocketsActionTypes } from "types/redux/Sockets";
import { IRootState } from "components/common/store";
import "styles/global.scss";

import { Box, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -ChattingDrawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

export const errorMessageCreator = (errorCode: string): string => {
  switch (errorCode) {
    case "invalid_user":
      return "찾으려는 사용자가 존재하지 않습니다.";
    case "wrong_game_access":
      return "잘못된 접근입니다. 게임 생성 혹은 참가를 통해 시작해주세요.";
    case "auth_failed":
      return "로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.";
    case "already_login":
      return "이미 로그인 되어있는 계정입니다. 로그아웃 후 다시 시도해주세요.";
    case "kicked":
      return "채팅방에서 강제 퇴장당하였습니다.";
    case "banned":
      return "채팅방에서 차단되었습니다. 같은 채팅방은 다시 입장이 불가합니다.";
    default:
      return "에러가 발생하였습니다.";
  }
};

export default function AppHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const paramsCode: string | undefined = qs.parse(window.location.search)
    .error as string;
  const notiRef = useRef<HTMLDivElement>(null);
  const status = useSelector((state: IRootState) => state.loginStatus);
  const dispatch = useDispatch();

  const loadMyData = async () => {
    const token = localStorage.getItem("accessToken");

    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await UserService.getMe();

    dispatch({
      type: MyInfoActionTypes.MYINFO_UPDATE,
      payload: {
        nickname: response.data.nickname,
        imgURL: response.data.imgPath,
        status: "login",
      },
    });
  };

  setTimeout(() => {
    if (notiRef.current) notiRef.current.style.animationName = "slideup";
  }, 5000);

  useLayoutEffect(() => {
    const token = localStorage.getItem("accessToken");
    const chattingSocket = io(apiURL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: SocketsActionTypes.CHATTINGSOCKET_UPDATE,
      payload: chattingSocket,
    });

    const alertMessage = (message: string) => {
      alert(message);
    };

    const socketAlreadyLogin = () => {
      window.location.href = "/login?error=already_login";
    };

    // error handling
    if (chattingSocket) {
      chattingSocket.on("errorAlreadyLogin", socketAlreadyLogin);
      chattingSocket.on("errorChatroomFull", alertMessage);
      chattingSocket.on("errorChatroomEntrance", alertMessage);
    }
    loadMyData();

    return () => {
      chattingSocket.off("errorChatroomFull", alertMessage);
      chattingSocket.off("errorAlreadyLogin", socketAlreadyLogin);
      chattingSocket.off("errorChatroomEntrance", alertMessage);
    };
  }, []);

  return (
    <>
      {paramsCode === undefined ? null : (
        <ErrorNotification
          errorMessage={errorMessageCreator(paramsCode)}
          ref={notiRef}
        />
      )}
      <Box id="AppHeader-container" className="flex-container">
        <CssBaseline />
        <AppBar open={open} setOpen={setOpen} />
        {status === "game" ? null : <FriendDrawer />}
        <Main id="Main-box" open={open}>
          <Routes>
            <Route path="/*" element={<MainRoute />} />
          </Routes>
        </Main>
        <ChattingDrawer open={open} setOpen={setOpen} />
      </Box>
    </>
  );
}
