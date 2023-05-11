import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChattingUserDetail, ChattingRoomDetail } from "types/Detail";
import RoomEditor from "components/common/chatting/RoomEditor";
import RoomUsers from "components/common/chatting/RoomUsers";
import RoomLeave from "components/common/chatting/RoomLeave";
import MyMessage from "components/common/chatting/MyMessage";
import OtherMessage from "components/common/chatting/OtherMessage";
import { ChattingUserRoleType } from "constant";
import { IRootState } from "components/common/store";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";
import { socket } from "socket";

import { Box } from "@mui/material";
import { Input, Button } from "@mui/joy";

export interface ChatObject {
  user: ChattingUserDetail;
  message: string;
}

const ChattingRoom = () => {
  const currentChatting: ChattingRoomDetail | null = useSelector(
    (state: IRootState) => state.currentChatting.chattingRoom
  );
  // API 요청
  const [roomStatus, setRoomStatus] = useState<string>("chat");
  const [myDetail, setMyDetail] = useState<ChattingUserDetail>({
    nickname: "chanhyle",
    imgURL: "../image.png",
    role: ChattingUserRoleType.owner,
  });
  const [chatting, setChatting] = useState<ChatObject[]>([
    {
      user: {
        nickname: "chanhyle",
        imgURL: "../image.png",
        role: ChattingUserRoleType.owner,
      },
      message:
        "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
    },
    {
      user: {
        nickname: "mgo",
        imgURL: "../image.png",
        role: ChattingUserRoleType.admin,
      },
      message: "2",
    },
  ]);

  const [chattingInput, setChattingInput] = useState<string>("");

  const handleChattingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target: HTMLInputElement = e.target;
    setChattingInput(target.value);
  };

  const handleAddChatting = (e: React.FormEvent) => {
    e.preventDefault();
    setChatting([
      ...chatting,
      {
        user: myDetail,
        message: chattingInput,
      },
    ]);
    setChattingInput("");
  };

  // const queryClient = useQueryClient();

  // useEffect(() => {
  //   socket.on('data', (data) => {
  //     // 데이터를 수신할 때마다, 쿼리 캐시를 업데이트합니다.
  //     queryClient.setQueryData('data', data);
  //   });
  // }, [queryClient]);

  return (
    <Box id="page">
      {roomStatus === "chat" && (
        <>
          <Box className="page-header">
            <Box>{currentChatting!.chatroomName}</Box>
          </Box>
          <Box className="page-body chatting-box">
            <Box className="chatting-display overflow">
              {chatting.map((value) => {
                return (
                  <Box className="chatting">
                    {myDetail.nickname === value.user.nickname ? (
                      <MyMessage myChat={value} />
                    ) : (
                      <OtherMessage otherChat={value} />
                    )}
                  </Box>
                );
              })}
            </Box>
            <Box className="chatting-input flex-container">
              <form className="input" onSubmit={handleAddChatting}>
                <Input
                  value={chattingInput}
                  placeholder="채팅을 입력하세요."
                  onChange={handleChattingInput}
                ></Input>
              </form>
              <Button>전송</Button>
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
