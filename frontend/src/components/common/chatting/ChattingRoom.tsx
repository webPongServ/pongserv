import { useState } from "react";
import { ChatRoomInfo } from "./WaitingRoom";
import RoomEditor from "./RoomEditor";
import RoomUsers from "./RoomUsers";

import { Box } from "@mui/material";
import { Input, Button } from "@mui/joy";

type HandleRoomID = { roomID: string; setRoomID: Function };

const ChattingRoom = (props: HandleRoomID) => {
  // API 요청
  const [roomDetail, setRoomDetail] = useState<ChatRoomInfo>({
    id: "202304230002",
    title: "옥상으로 따라와",
    type: "protected",
    current: 4,
    max: 9,
    owner: "mgo",
    createdAt: new Date(),
  });
  const [roomStatus, setRoomStatus] = useState<string>("chat");

  console.log(setRoomDetail);

  return (
    <Box sx={{ p: 5, height: "90%" }}>
      {roomStatus === "chat" && (
        <>
          <Box className="flex-container header" sx={{ height: "10%" }}>
            <div style={{ fontSize: "25px", flexGrow: 1 }}>
              {roomDetail.title}
            </div>
          </Box>
          <Box
            sx={{
              height: "80%",
              p: 1,
            }}
            className="chatting-box"
          >
            <Box sx={{ p: 3, height: "90%", overflow: "auto" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Rhoncus dolor purus non enim praesent elementum facilisis leo vel.
              Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
              gravida rutrum quisque non tellus. Convallis convallis tellus id
              interdum velit laoreet id donec ultrices. Odio morbi quis commodo
              odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum
              est ultricies integer quis. Cursus euismod quis viverra nibh cras.
              Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt
              lobortis feugiat vivamus at augue. At augue eget arcu dictum
              varius duis at consectetur lorem. Velit sed ullamcorper morbi
              tincidunt. Lorem donec massa sapien faucibus et molestie ac.
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
              ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
              elementum integer enim neque volutpat ac tincidunt. Ornare
              suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
              volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
              Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
              ornare massa eget egestas purus viverra accumsan in. In hendrerit
              gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
              aliquam sem et tortor. Habitant morbi tristique senectus et.
              Adipiscing elit duis tristique sollicitudin nibh sit. Ornare
              aenean euismod elementum nisi quis eleifend. Commodo viverra
              maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
              aliquam ultrices sagittis orci a.
            </Box>
            <Box className="flex-container" sx={{ height: "10%", gap: 1 }}>
              <Input
                placeholder="채팅을 입력하세요."
                sx={{ width: "80%" }}
              ></Input>
              <Button>전송</Button>
            </Box>
          </Box>
          <Box className="flex-container header" sx={{ height: "10%", gap: 1 }}>
            <Button
              sx={{ width: "33%" }}
              onClick={() => {
                setRoomStatus("users");
              }}
            >
              유저 목록
            </Button>
            <Button
              sx={{ width: "33%" }}
              onClick={() => {
                setRoomStatus("edit");
              }}
            >
              채팅방 정보 수정
            </Button>
            <Button
              sx={{ width: "33%" }}
              variant="outlined"
              onClick={() => {
                props.setRoomID("waiting");
              }}
            >
              채팅방 나가기
            </Button>
          </Box>
        </>
      )}
      {roomStatus === "edit" && (
        <RoomEditor
          title={roomDetail.title}
          type={roomDetail.type}
          max={roomDetail.max}
          setRoomStatus={setRoomStatus}
        />
      )}
      {roomStatus === "users" && <RoomUsers setRoomStatus={setRoomStatus} />}
    </Box>
  );
};

export default ChattingRoom;
