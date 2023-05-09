import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PasswordFormCard from "components/common/chatting/PasswordFormCard";
import RoomCard from "components/common/chatting/RoomCard";
import EmptyListMessage from "components/common/utils/EmptyListMessage";
import CustomIconButton from "components/common/utils/CustomIconButton";
import { ChatRoomDetail } from "types/Detail";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import ChattingService from "API/ChattingService";
import "styles/ChattingDrawer.scss";
import "styles/global.scss";

import { Box, Pagination } from "@mui/material";
import { Button } from "@mui/joy";
import SyncIcon from "@mui/icons-material/Sync";

const WaitingRoom = () => {
  const dispatch = useDispatch();

  // chatroom은 전역에서 관리하지 않음 => 로컬에서도 처음에 받아오는 것만(없어진 것 예외처리 필요)
  // 보이지 않을 수도 있는데, 상태로 관리하는 것은 불필요한 낭비일 수 있음 => 새로고침 버튼을 두자
  const [chatRoomList, setChatRoomList] = useState<ChatRoomDetail[]>([]);
  const [pwIndex, setPwIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(1);

  const getChatRoomList = async () => {
    // fetch data
    const response = await ChattingService.getChattingRooms();
    setChatRoomList(response.data);
  };

  useEffect(() => {
    getChatRoomList();
  }, []);

  return (
    <Box id="page">
      <Box className="page-header">채팅 대기실</Box>
      <Box className="page-body">
        <Box className="list">
          {chatRoomList.length === 0 ? (
            <EmptyListMessage message="채팅방이 존재하지 않습니다!" />
          ) : (
            chatRoomList.map((value, index) =>
              5 * (page - 1) <= index && index < 5 * page ? (
                index === pwIndex ? (
                  <PasswordFormCard room={value} setPwIndex={setPwIndex} />
                ) : (
                  <RoomCard
                    room={value}
                    index={index}
                    setPwIndex={setPwIndex}
                  />
                )
              ) : null
            )
          )}
        </Box>
        <Box className="pagination flex-container">
          <Pagination
            count={Math.floor(chatRoomList.length / 5) + 1}
            variant="outlined"
            shape="rounded"
            onChange={(e, number) => {
              setPage(number);
            }}
          />
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
