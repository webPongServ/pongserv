import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import io from "socket.io-client";
import qs from "query-string";
import MainRoute from "components/common/MainRoute";
import AppBar from "components/common/AppBar";
import FriendDrawer from "components/common/FriendDrawer";
import ChattingDrawer from "components/common/ChattingDrawer";
import ErrorNotification from "components/utils/ErrorNotification";
import ResultNotification from "components/utils/ResultNotification";
import { ChattingDrawerWidth, FriendStatusType } from "constant";
import { useDispatch, useSelector } from "react-redux";
import { apiURL } from "API/api";
import instance from "API/api";
import UserService from "API/UserService";
import { MyInfoActionTypes } from "types/redux/MyInfo";
import { SocketsActionTypes } from "types/redux/Sockets";
import { IRootState } from "components/common/store";
import RequestGameModal from "components/common/RequestGameModal";
import { RequesterDetail } from "types/Detail";
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
    case "direct_rejected":
      return "상대방이 대결 신청을 거절하였습니다.";
    case "auth_failed":
      return "로그인 정보가 올바르지 않습니다. 다시 로그인 해주세요.";
    case "twofactor_failed":
      return "2차 인증에 실패하였습니다.";
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

export const resultMessageCreator = (resultCode: string): string => {
  switch (resultCode) {
    case "win":
      return "게임에서 승리하셨습니다! 🏆";
    case "loss":
      return "게임에서 패배하셨습니다! 😭";
    case "dodge":
      return "상대방이 게임에서 탈주하여 승리로 기록되었습니다.";
    default:
      return "에러가 발생하였습니다.";
  }
};

export default function AppHeader() {
  const [open, setOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const paramsCodeError: string | undefined = qs.parse(window.location.search)
    .error as string;
  const paramsCodeResult: string | undefined = qs.parse(window.location.search)
    .result as string;
  const errorRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const loginStatus = useSelector((state: IRootState) => state.loginStatus);
  const [requester, setRequester] = useState<RequesterDetail>({
    nickname: "",
    imgURL: "",
    roomId: "",
  });
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
        status: FriendStatusType.login,
      },
    });
  };

  setTimeout(() => {
    if (errorRef.current) errorRef.current.style.animationName = "slideup";
    if (resultRef.current) resultRef.current.style.animationName = "slideup";
  }, 5000);

  useLayoutEffect(() => {
    // if null 적용하기
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

    const socketChatroomBeingRequestedGame = (data: {
      gmRmId: string;
      rqstrNick: string;
      rqstrImg: string;
    }) => {
      setRequester({
        nickname: data.rqstrNick,
        imgURL: data.rqstrImg,
        roomId: data.gmRmId,
      });
      setOpenModal(true);
    };

    if (chattingSocket) {
      chattingSocket.on(
        "chatroomBeingRequestedGame",
        socketChatroomBeingRequestedGame
      );
      // error handling
      chattingSocket.on("errorAlreadyLogin", socketAlreadyLogin);
      chattingSocket.on("errorChatroomFull", alertMessage);
      chattingSocket.on("errorChatroomEntrance", alertMessage);
      chattingSocket.on("errorChatroomMessage", alertMessage);
      chattingSocket.on("errorChatroomLeaving", alertMessage);
      chattingSocket.on("errorChatroomKick", alertMessage);
      chattingSocket.on("errorChatroomRegisterBan", alertMessage);
      chattingSocket.on("errorChatroomMute", alertMessage);
      chattingSocket.on("errorChatroomEmpowerment", alertMessage);
      chattingSocket.on("errorChatroomCreation", alertMessage);
      chattingSocket.on("errorChatroomRemovalBan", alertMessage);
      chattingSocket.on("errorChatroomDirectMessage", alertMessage);
    }
    loadMyData();

    return () => {
      chattingSocket.off(
        "chatroomBeingRequestedGame",
        socketChatroomBeingRequestedGame
      );
      chattingSocket.off("errorChatroomFull", alertMessage);
      chattingSocket.off("errorAlreadyLogin", socketAlreadyLogin);
      chattingSocket.off("errorChatroomEntrance", alertMessage);
      chattingSocket.off("errorChatroomMessage", alertMessage);
      chattingSocket.off("errorChatroomLeaving", alertMessage);
      chattingSocket.off("errorChatroomKick", alertMessage);
      chattingSocket.off("errorChatroomRegisterBan", alertMessage);
      chattingSocket.off("errorChatroomMute", alertMessage);
      chattingSocket.off("errorChatroomEmpowerment", alertMessage);
      chattingSocket.off("errorChatroomCreation", alertMessage);
      chattingSocket.off("errorChatroomRemovalBan", alertMessage);
      chattingSocket.off("errorChatroomDirectMessage", alertMessage);
    };
  }, []);

  return (
    <>
      {paramsCodeError !== undefined && paramsCodeResult === undefined && (
        <ErrorNotification
          errorMessage={errorMessageCreator(paramsCodeError)}
          ref={errorRef}
        />
      )}
      {paramsCodeError === undefined && paramsCodeResult !== undefined && (
        <ResultNotification
          resultMessage={resultMessageCreator(paramsCodeResult)}
          ref={resultRef}
        />
      )}
      <Box id="AppHeader-container" className="flex-container">
        <CssBaseline />
        <AppBar open={open} setOpen={setOpen} />
        {loginStatus === "game" ? null : <FriendDrawer />}
        <Main id="Main-box" open={open}>
          <Routes>
            <Route path="/*" element={<MainRoute />} />
          </Routes>
        </Main>
        <ChattingDrawer open={open} setOpen={setOpen} />
        <RequestGameModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          requester={requester}
        />
      </Box>
    </>
  );
}
