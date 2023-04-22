import { useState } from "react";

import { Box } from "@mui/material";
import IconButton from "@mui/joy/IconButton";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { Input, Button } from "@mui/joy";

type HandleRoomID = { roomID: number; setRoomID: Function };
type RoomDetail = {
  title: string;
  owner: string;
};

const ChattingRoom = (props: HandleRoomID) => {
  // API 요청
  const [roomDetail, setRoomDetail] = useState<RoomDetail>({
    title: "옥상으로 따라와",
    owner: "mgo",
  });
  return (
    <Box sx={{ height: "100%", p: 3 }}>
      <Box className="flex-container header">
        <div style={{ fontSize: "20px" }}>{roomDetail.title}</div>
        <div style={{ marginLeft: "auto" }}>
          <IconButton
            onClick={() => {
              props.setRoomID(0);
            }}
          >
            <GroupIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              props.setRoomID(0);
            }}
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              props.setRoomID(0);
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </Box>
      <Box sx={{ height: "85%", p: 3 }}>hello!</Box>
      <Box className="flex-container">
        <Input sx={{ width: "80%" }}></Input>
        <Button>전송</Button>
      </Box>
    </Box>
  );
};

export default ChattingRoom;
