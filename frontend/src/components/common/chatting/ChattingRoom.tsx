import { useState } from "react";
import { useSelector } from "react-redux";
import {
  ChattingUserDetail,
  ChattingRoomDetail,
  UserDetail,
} from "types/Detail";
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
  user: UserDetail;
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
      user: { nickname: "chanhyle", imgURL: "../image.png", status: "login" },
      message:
        "1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111",
    },
    {
      user: { nickname: "mgo", imgURL: "../image.png", status: "login" },
      message: "2",
    },
    {
      user: { nickname: "susong", imgURL: "../image.png", status: "login" },
      message: "3",
    },
    {
      user: { nickname: "seongtki", imgURL: "../image.png", status: "login" },
      message: "4",
    },
    {
      user: { nickname: "mgo", imgURL: "../image.png", status: "login" },
      message: "5",
    },
    {
      user: { nickname: "susong", imgURL: "../image.png", status: "login" },
      message: "6",
    },
    {
      user: { nickname: "seongtki", imgURL: "../image.png", status: "login" },
      message: "7",
    },
    {
      user: { nickname: "chanhyle", imgURL: "../image.png", status: "login" },
      message: "8",
    },
    {
      user: { nickname: "chanhyle", imgURL: "../image.png", status: "login" },
      message: "9",
    },
    {
      user: { nickname: "mgo", imgURL: "../image.png", status: "login" },
      message: "10",
    },
  ]);

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
              <Input className="input" placeholder="채팅을 입력하세요."></Input>
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
