import { useEffect, useState } from "react";
import RoomCard from "components/common/chatting/RoomCard";
import { ChatRoomDetail } from "types/Detail";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import CustomIconButton from "../utils/CustomIconButton";
import "styles/Chatting.scss";
import "styles/global.scss";

import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import SyncIcon from "@mui/icons-material/Sync";

const WaitingRoom = () => {
  const dispatch = useDispatch();

  // chatroom은 전역에서 관리하지 않음 => 로컬에서도 처음에 받아오는 것만(없어진 것 예외처리 필요)
  // 보이지 않을 수도 있는데, 상태로 관리하는 것은 불필요한 낭비일 수 있음 => 새로고침 버튼을 두자
  const [chatRoomList, setChatRoomList] = useState<ChatRoomDetail[]>([]);

  const getChatRoomList = () => {
    // fetch data
    setChatRoomList([
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
        title: "[DM] susong, mgo",
        owner: "mgo",
        type: "private",
        current: 1,
        max: 2,
        createdAt: new Date(),
      },
      {
        id: "202304230003",
        title: "[DM] susong, mgo",
        owner: "mgo",
        type: "private",
        current: 1,
        max: 2,
        createdAt: new Date(),
      },
      {
        id: "202304230003",
        title: "[DM] susong, mgo",
        owner: "mgo",
        type: "private",
        current: 1,
        max: 2,
        createdAt: new Date(),
      },
      {
        id: "202304230003",
        title: "[DM] susong, mgo",
        owner: "mgo",
        type: "private",
        current: 1,
        max: 2,
        createdAt: new Date(),
      },
      {
        id: "202304230003",
        title: "[DM] susong, mgo",
        owner: "mgo",
        type: "private",
        current: 1,
        max: 2,
        createdAt: new Date(),
      },
    ]);
  };

  useEffect(() => {
    getChatRoomList();
  }, []);

  return (
    <Box id="page">
      <Box className="page-header">채팅 대기실</Box>
      <Box className="page-body overflow">
        <Box className="chatting-card">
          {chatRoomList.map((value) => (
            <RoomCard
              id={value.id}
              title={value.title}
              owner={value.owner}
              type={value.type}
              current={value.current}
              max={value.max}
              createdAt={value.createdAt}
            />
          ))}
        </Box>
      </Box>
      <Box className="page-footer flex-container">
        <Button
          className="big"
          onClick={() =>
            dispatch({
              type: CurrentChattingActionTypes.UPDATE_STATUS_CREATING,
              payload: "",
            })
          }
        >
          채팅방 생성
        </Button>
        <CustomIconButton
          class=""
          icon={<SyncIcon />}
          handleFunction={getChatRoomList}
        />
      </Box>
    </Box>
  );
};

export default WaitingRoom;
