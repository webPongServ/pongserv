import { useState } from "react";
import RoomCard from "components/common/chatting/RoomCard";

import { Box } from "@mui/material";
import { Button } from "@mui/joy";

export type ChatRoomInfo = {
  id: string;
  title: string;
  owner: string;
  type: string;
  current: number;
  max: number;
  createdAt: Date;
};

type HandleRoomID = { roomID: string; setRoomID: Function };

const WaitingRoom = (props: HandleRoomID) => {
  const [chatRoomList, setChatRoomList] = useState<ChatRoomInfo[]>([
    {
      id: "202304230001",
      title: "이기면 100만원~",
      owner: "noname_12",
      type: "public",
      current: 4,
      max: 5,
      createdAt: new Date(),
    },
    {
      id: "202304230002",
      title: "옥상으로 따라와",
      owner: "mgo",
      type: "protected",
      current: 4,
      max: 9,
      createdAt: new Date(),
    },
    {
      id: "202304230003",
      title: "[DM] mgo님과의 채팅방",
      owner: "mgo",
      type: "private",
      current: 1,
      max: 2,
      createdAt: new Date(),
    },
    {
      id: "202304230003",
      title: "[DM] mgo님과의 채팅방",
      owner: "mgo",
      type: "private",
      current: 1,
      max: 2,
      createdAt: new Date(),
    },
    {
      id: "202304230003",
      title: "[DM] mgo님과의 채팅방",
      owner: "mgo",
      type: "private",
      current: 1,
      max: 2,
      createdAt: new Date(),
    },
    {
      id: "202304230003",
      title: "[DM] mgo님과의 채팅방",
      owner: "mgo",
      type: "private",
      current: 1,
      max: 2,
      createdAt: new Date(),
    },
    {
      id: "202304230003",
      title: "[DM] mgo님과의 채팅방",
      owner: "mgo",
      type: "private",
      current: 1,
      max: 2,
      createdAt: new Date(),
    },
  ]);

  console.log(setChatRoomList);

  return (
    <Box sx={{ p: 2, height: "90%" }}>
      <Box className="width-center overflow" sx={{ p: 2, height: "90%" }}>
        {chatRoomList.map((value) => (
          <RoomCard
            id={value.id}
            title={value.title}
            owner={value.owner}
            type={value.type}
            current={value.current}
            max={value.max}
            createdAt={value.createdAt}
            roomID={props.roomID}
            setRoomID={props.setRoomID}
          />
        ))}
      </Box>
      <Box className="flex-container" sx={{ height: "10%" }}>
        <Button
          className="chat-container"
          onClick={() => props.setRoomID("creator")}
        >
          체팅방 생성
        </Button>
      </Box>
    </Box>
  );
};

export default WaitingRoom;
