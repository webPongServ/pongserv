import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChattingUserDetail, ChattingRoomDetail } from "types/Detail";
import RoomEditor from "components/common/chatting/RoomEditor";
import RoomUsers from "components/common/chatting/RoomUsers";
import RoomLeave from "components/common/chatting/RoomLeave";
import MyMessage from "components/common/chatting/MyMessage";
import OtherMessage from "components/common/chatting/OtherMessage";
import InformMessage from "components/common/chatting/InformMessage";
import { IRootState } from "components/common/store";
import { ChattingUserRoleType } from "constant";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import { Input, Button } from "@mui/joy";

export interface ChatObject {
  user: ChattingUserDetail | null;
  message: string;
  isMine: boolean | null;
}

const ChattingRoom = () => {
  const currentChattingRoomDetail: ChattingRoomDetail | null = useSelector(
    (state: IRootState) => state.currentChatting.chattingRoomDetail!
  );
  const myDetail: ChattingUserDetail = useSelector(
    (state: IRootState) => state.currentChatting.myDetail!
  );
  const chattingSocket: any = useSelector(
    (state: IRootState) => state.sockets.chattingSocket!
  );
  const chattingRef = useRef<HTMLDivElement>(null);
  // API 요청
  const [roomStatus, setRoomStatus] = useState<string>("chat");
  const [chatting, setChatting] = useState<ChatObject[]>([]);

  const [chattingInput, setChattingInput] = useState<string>("");
  const dispatch = useDispatch();

  const handleChattingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.target;
    setChattingInput(target.value);
  };

  const handleSubmitSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (chattingInput === "") return;
    chattingSocket.emit(
      "chatroomMessage",
      {
        id: currentChattingRoomDetail.id,
        msg: chattingInput,
      },
      () => {
        setChatting([
          ...chatting,
          {
            user: myDetail,
            message: chattingInput,
            isMine: true,
          },
        ]);
        setChattingInput("");
      }
    );
  };

  const handleClickSend = () => {
    if (chattingInput === "") return;
    chattingSocket.emit(
      "chatroomMessage",
      {
        id: currentChattingRoomDetail.id,
        msg: chattingInput,
      },
      () => {
        setChatting([
          ...chatting,
          {
            user: myDetail,
            message: chattingInput,
            isMine: true,
          },
        ]);
        setChattingInput("");
      }
    );
  };

  useEffect(() => {
    if (chattingRef.current)
      chattingRef.current.scrollTop = chattingRef.current.scrollHeight;

    const socketChatroomMessage = (data: {
      nickname: string;
      imgPath: string;
      role: string;
      msg: string;
    }) => {
      setChatting([
        ...chatting,
        {
          user: {
            nickname: data.nickname,
            imgURL: data.imgPath,
            role: data.role,
          },
          message: data.msg,
          isMine: false,
        },
      ]);
    };

    const socketChatroomWelcome = (nickname: string) => {
      setChatting([
        ...chatting,
        {
          user: null,
          message: nickname + "님이 입장하셨습니다.",
          isMine: null,
        },
      ]);
    };

    const socketChatroomLeaving = (nickname: string) => {
      setChatting([
        ...chatting,
        {
          user: null,
          message: nickname + "님이 퇴장하셨습니다.",
          isMine: null,
        },
      ]);
    };

    const socketChatroomBeingKicked = (data: {
      chtrmId: string;
      nickname: string;
    }) => {
      if (data.nickname === myDetail.nickname) {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_STATUS_ERROR,
          payload: "error-kicked",
        });
      } else {
        setChatting([
          ...chatting,
          {
            user: null,
            message: data.nickname + "님이 강제 퇴장당하였습니다.",
            isMine: null,
          },
        ]);
      }
    };

    const socketChatroomBeingMuted = (data: {
      chtrmId: string;
      nickname: string;
    }) => {
      // UI 확실히하기
      setChatting([
        ...chatting,
        {
          user: null,
          message: data.nickname + "님이 60초간 벙어리가 되었습니다.",
          isMine: null,
        },
      ]);
    };

    const socketChatroomBeingRegisteredBan = (data: {
      chtrmId: string;
      nickname: string;
    }) => {
      if (data.nickname === myDetail.nickname) {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_STATUS_ERROR,
          payload: "error-banned",
        });
      } else {
        setChatting([
          ...chatting,
          {
            user: null,
            message: data.nickname + "님이 차단되었습니다.",
            isMine: null,
          },
        ]);
      }
    };

    const socketChatroomBeingEmpowered = (data: {
      chtrmId: string;
      nickname: string;
    }) => {
      if (data.nickname === myDetail.nickname) {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_MYDETAIL_ROLE,
          payload: ChattingUserRoleType.admin,
        });
      }
      setChatting([
        ...chatting,
        {
          user: null,
          message: data.nickname + "님이 관리자가 되었습니다.",
          isMine: null,
        },
      ]);
    };

    const socketChatroomBeingRemovedBan = (data: {
      chtrmId: string;
      nickname: string;
    }) => {
      if (data.nickname !== myDetail.nickname) {
        setChatting([
          ...chatting,
          {
            user: null,
            message: data.nickname + "님이 차단 해제되었습니다.",
            isMine: null,
          },
        ]);
      }
    };

    const socketChatroomAuthChange = (data: {
      chtrmId: string;
      nickname: string;
      auth: string;
    }) => {
      if (data.nickname === myDetail.nickname) {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_MYDETAIL_ROLE,
          payload: data.auth,
        });
      }
      setChatting([
        ...chatting,
        {
          user: null,
          message:
            data.nickname +
            `님이 새로운 ${
              data.auth === ChattingUserRoleType.owner
                ? "방장"
                : data.auth === ChattingUserRoleType.admin
                ? "관리자"
                : "일반 유저"
            }이 되었습니다.`,
          isMine: null,
        },
      ]);
    };

    if (chattingSocket) {
      chattingSocket.on("chatroomMessage", socketChatroomMessage);
      chattingSocket.on("chatroomWelcome", socketChatroomWelcome);
      chattingSocket.on("chatroomLeaving", socketChatroomLeaving);
      chattingSocket.on("chatroomBeingKicked", socketChatroomBeingKicked);
      chattingSocket.on("chatroomBeingMuted", socketChatroomBeingMuted);
      chattingSocket.on(
        "chatroomBeingRegisteredBan",
        socketChatroomBeingRegisteredBan
      );
      chattingSocket.on("chatroomBeingEmpowered", socketChatroomBeingEmpowered);
      chattingSocket.on(
        "chatroomBeingRemovedBan",
        socketChatroomBeingRemovedBan
      );
      chattingSocket.on("chatroomAuthChange", socketChatroomAuthChange);
    }

    return () => {
      chattingSocket.off("chatroomMessage", socketChatroomMessage);
      chattingSocket.off("chatroomWelcome", socketChatroomWelcome);
      chattingSocket.off("chatroomLeaving", socketChatroomLeaving);
      chattingSocket.off("chatroomBeingKicked", socketChatroomBeingKicked);
      chattingSocket.off("chatroomBeingMuted", socketChatroomBeingMuted);
      chattingSocket.off(
        "chatroomBeingRegisteredBan",
        socketChatroomBeingRegisteredBan
      );
      chattingSocket.off(
        "chatroomBeingEmpowered",
        socketChatroomBeingEmpowered
      );
      chattingSocket.off(
        "chatroomBeingRemovedBan",
        socketChatroomBeingRemovedBan
      );
      chattingSocket.off("chatroomAuthChange", socketChatroomAuthChange);
    };
  }, [chatting, roomStatus]);

  useEffect(() => {
    if (!currentChattingRoomDetail.isAlrdyAttnd) {
      setChatting([
        ...chatting,
        {
          user: null,
          message: myDetail.nickname + "님이 입장하셨습니다.",
          isMine: null,
        },
      ]);
    }
  }, []);

  return (
    <Box id="page">
      {roomStatus === "chat" && (
        <>
          <Box className="page-header">
            <Box>{currentChattingRoomDetail!.chatroomName}</Box>
          </Box>
          <Box className="page-body chatting-box">
            <Box className="chatting-display overflow" ref={chattingRef}>
              {chatting.map((value, index) => {
                return value.user === null ? (
                  <InformMessage
                    key={`inform-message-${index}`}
                    informChat={value}
                  />
                ) : value.isMine ? (
                  <MyMessage
                    key={`my-message-${value.user!.nickname}-${index}`}
                    myChat={value}
                  />
                ) : (
                  <OtherMessage
                    key={`other-message-${value.user!.nickname}-${index}`}
                    otherChat={value}
                  />
                );
              })}
            </Box>
            <Box className="chatting-input flex-container">
              <form className="input" onSubmit={handleSubmitSend}>
                <Input
                  autoFocus
                  value={chattingInput}
                  placeholder="채팅을 입력하세요."
                  slotProps={{ input: { maxLength: 1000 } }}
                  onChange={handleChattingInput}
                ></Input>
              </form>
              <Button onClick={handleClickSend}>전송</Button>
            </Box>
          </Box>
          <Box className="page-footer flex-container">
            <Button
              className="small"
              onClick={() => {
                setRoomStatus("users");
              }}
            >
              유저/차단 목록
            </Button>
            <Button
              className="small"
              disabled={myDetail.role !== ChattingUserRoleType.owner}
              onClick={() => {
                setRoomStatus("edit");
              }}
            >
              채팅방 정보 수정
            </Button>
            <Button
              className="small"
              variant="outlined"
              onClick={() => {
                setRoomStatus("leave");
              }}
            >
              채팅방 나가기
            </Button>
          </Box>
        </>
      )}
      {roomStatus === "edit" && (
        <RoomEditor
          chatroomName={currentChattingRoomDetail!.chatroomName}
          type={currentChattingRoomDetail!.type}
          maxCount={currentChattingRoomDetail!.maxCount}
          setRoomStatus={setRoomStatus}
        />
      )}
      {roomStatus === "users" && (
        <RoomUsers
          myDetail={myDetail}
          chatting={chatting}
          setChatting={setChatting}
          setRoomStatus={setRoomStatus}
        />
      )}
      {roomStatus === "leave" && <RoomLeave setRoomStatus={setRoomStatus} />}
    </Box>
  );
};

export default ChattingRoom;
