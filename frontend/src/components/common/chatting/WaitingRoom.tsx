import { useState } from "react";
import RoomCard from "components/common/chatting/RoomCard";
import { Box } from "@mui/material";
import { Button } from "@mui/joy";

type ChatRoomInfo = {
  id: number;
  title: string;
  owner: string;
  isPublic: boolean;
  current: number;
  max: number;
  createdAt: Date;
};

type HandleRoomID = { roomID: number; setRoomID: Function };

const WaitingPage = (props: HandleRoomID) => {
  const [chatRoomList, setChatRoomList] = useState<ChatRoomInfo[]>([
    {
      id: 1,
      title: "이기면 100만원~",
      owner: "noname_12",
      isPublic: true,
      current: 4,
      max: 5,
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "mgo님의 채팅방",
      owner: "mgo",
      isPublic: false,
      current: 4,
      max: 10,
      createdAt: new Date(),
    },
  ]);
  return (
    <>
      <Box className="width-center overflow" sx={{ p: 2, height: "85%" }}>
        {chatRoomList.map((value) => (
          <RoomCard
            id={value.id}
            title={value.title}
            owner={value.owner}
            isPublic={value.isPublic}
            current={value.current}
            max={value.max}
            createdAt={value.createdAt}
            setRoomID={props.setRoomID}
          />
        ))}
      </Box>
      <div className="center">
        <Button className="chat-container">체팅방 생성</Button>
      </div>
    </>
  );
};

export default WaitingPage;
