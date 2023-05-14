import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { ChattingUserDetail, ChattingRoomDetail } from "types/Detail";
import RoomEditor from "components/common/chatting/RoomEditor";
import RoomUsers from "components/common/chatting/RoomUsers";
import RoomLeave from "components/common/chatting/RoomLeave";
import MyMessage from "components/common/chatting/MyMessage";
import OtherMessage from "components/common/chatting/OtherMessage";
import InformMessage from "components/common/chatting/InformMessage";
import { IRootState } from "components/common/store";
import { ChattingUserRoleType } from "constant";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import { Input, Button } from "@mui/joy";

export interface ChatObject {
  user: ChattingUserDetail | null;
  message: string;
}

const ChattingRoom = () => {
  const currentChatting: ChattingRoomDetail | null = useSelector(
    (state: IRootState) => state.currentChatting.chattingRoom!
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
        id: currentChatting.id,
        msg: chattingInput,
      },
      () => {
        setChatting([
          ...chatting,
          {
            user: myDetail,
            message: chattingInput,
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
        id: currentChatting.id,
        msg: chattingInput,
      },
      () => {
        setChatting([
          ...chatting,
          {
            user: myDetail,
            message: chattingInput,
          },
        ]);
        setChattingInput("");
      }
    );
  };

  chattingSocket.on(
    "chatroomMessage",
    (data: {
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
        },
      ]);
    }
  );

  chattingSocket.on("chatroomWelcome", (nickname: string) => {
    setChatting([
      ...chatting,
      {
        user: null,
        message: nickname + "님이 입장하셨습니다.",
      },
    ]);
  });

  chattingSocket.on("chatroomLeaving", (nickname: string) => {
    setChatting([
      ...chatting,
      {
        user: null,
        message: nickname + "님이 퇴장하셨습니다.",
      },
    ]);
  });

  // const queryClient = useQueryClient();

  // useEffect(() => {
  //   socket.on('data', (data) => {
  //     // 데이터를 수신할 때마다, 쿼리 캐시를 업데이트합니다.
  //     queryClient.setQueryData('data', data);
  //   });
  // }, [queryClient]);

  useEffect(() => {
    if (chattingRef.current)
      chattingRef.current.scrollTop = chattingRef.current.scrollHeight;
  }, [chatting, roomStatus]);

  return (
    <Box id="page">
      {roomStatus === "chat" && (
        <>
          <Box className="page-header">
            <Box>{currentChatting!.chatroomName}</Box>
          </Box>
          <Box className="page-body chatting-box">
            <Box className="chatting-display overflow" ref={chattingRef}>
              {chatting.map((value, index) => {
                return (
                  <>
                    {value.user === null && (
                      <InformMessage informChat={value} index={index} />
                    )}
                    {value.user !== null &&
                      myDetail.nickname === value.user.nickname && (
                        <MyMessage myChat={value} index={index} />
                      )}
                    {value.user !== null &&
                      myDetail.nickname !== value.user.nickname && (
                        <OtherMessage otherChat={value} index={index} />
                      )}
                  </>
                );
              })}
            </Box>
            <Box className="chatting-input flex-container">
              <form className="input" onSubmit={handleSubmitSend}>
                <Input
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
          chatroomName={currentChatting!.chatroomName}
          type={currentChatting!.type}
          maxCount={currentChatting!.maxCount}
          setRoomStatus={setRoomStatus}
        />
      )}
      {roomStatus === "users" && (
        <RoomUsers myDetail={myDetail} setRoomStatus={setRoomStatus} />
      )}
      {roomStatus === "leave" && <RoomLeave setRoomStatus={setRoomStatus} />}
    </Box>
  );
};

export default ChattingRoom;
