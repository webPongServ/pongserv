import { useState } from "react";
import { ChatRoomDetail } from "types/Detail";
import RoomEditor from "components/common/chatting/RoomEditor";
import RoomUsers from "components/common/chatting/RoomUsers";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/CurrentChatting";
import { IRootState } from "components/common/store";
import "styles/global.scss";
import "styles/Chatting.scss";

import { Box } from "@mui/material";
import { Input, Button } from "@mui/joy";

export type MyDetail = { nickname: string; role: string; imgUrl: string };

const ChattingRoom = () => {
  const currentChatting = useSelector(
    (state: IRootState) => state.currentChatting.chatRoom
  );
  const dispatch = useDispatch();
  // API 요청
  const [roomStatus, setRoomStatus] = useState<string>("chat");
  const [myDetail, setMyDetail] = useState({
    nickname: "chanhyle",
    role: "owner",
    imgUrl: "../image.png",
  });

  console.log(setMyDetail);

  return (
    <Box id="page">
      {roomStatus === "chat" && (
        <>
          <Box className="page-header">{currentChatting.title}</Box>
          <Box className="page-body chatting-box">
            <Box className="chatting-display overflow">
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
              유저 목록
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
                dispatch({
                  type: CurrentChattingActionTypes.UPDATE_STATUS_WAITING,
                  payload: "",
                });
              }}
            >
              채팅방 나가기
            </Button>
          </Box>
        </>
      )}
      {roomStatus === "edit" && (
        <RoomEditor
          title={currentChatting.title}
          type={currentChatting.type}
          max={currentChatting.max}
          setRoomStatus={setRoomStatus}
        />
      )}
      {roomStatus === "users" && (
        <RoomUsers myDetail={myDetail} setRoomStatus={setRoomStatus} />
      )}
    </Box>
  );
};

export default ChattingRoom;
