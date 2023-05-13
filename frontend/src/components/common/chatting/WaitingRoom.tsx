import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PasswordFormCard from "components/common/chatting/PasswordFormCard";
import RoomCard from "components/common/chatting/RoomCard";
import EmptyListMessage from "components/utils/EmptyListMessage";
import CustomIconButton from "components/utils/CustomIconButton";
import { ChattingRoomDetail } from "types/Detail";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import ChattingService from "API/ChattingService";
import "styles/ChattingDrawer.scss";
import "styles/global.scss";

import { Box, Pagination } from "@mui/material";
import { Button } from "@mui/joy";
import SyncIcon from "@mui/icons-material/Sync";
import LoadingCircle from "components/utils/LoadingCircle";

const WaitingRoom = () => {
  const dispatch = useDispatch();

  // chatroom은 전역에서 관리하지 않음 => 로컬에서도 처음에 받아오는 것만(없어진 것 예외처리 필요)
  // 보이지 않을 수도 있는데, 상태로 관리하는 것은 불필요한 낭비일 수 있음 => 새로고침 버튼을 두자
  const [chattingRoomList, setChattingRoomList] = useState<
    ChattingRoomDetail[] | null
  >(null);
  const [pwIndex, setPwIndex] = useState<number>(-1);
  const [page, setPage] = useState<number>(1);

  const getChattingRoomList = async () => {
    setChattingRoomList(null);
    const response = await ChattingService.getChattingRooms();
    setChattingRoomList(response.data);
  };

  useEffect(() => {
    getChattingRoomList();
  }, []);

  return (
    <Box id="page">
      <Box className="page-header">
        <Box>대기실</Box>
      </Box>
      <Box className="page-body">
        {chattingRoomList === null && <LoadingCircle />}
        {chattingRoomList !== null && (
          <>
            <Box className="list">
              {chattingRoomList.length === 0 && (
                <EmptyListMessage message="채팅방이 존재하지 않습니다!" />
              )}
              {chattingRoomList.length !== 0 &&
                chattingRoomList.map((value, index) =>
                  5 * (page - 1) <= index && index < 5 * page ? (
                    index === pwIndex ? (
                      <PasswordFormCard
                        room={value}
                        setPwIndex={setPwIndex}
                        key={"password" + value.id}
                      />
                    ) : (
                      <RoomCard
                        room={value}
                        index={index}
                        setPwIndex={setPwIndex}
                        key={"chattingRoom" + value.id}
                      />
                    )
                  ) : null
                )}
            </Box>
            <Box className="pagination flex-container">
              <Pagination
                count={Math.ceil(
                  chattingRoomList === null ? 1 : chattingRoomList.length / 5
                )}
                variant="outlined"
                shape="rounded"
                onChange={(e, number) => {
                  setPage(number);
                }}
              />
            </Box>
          </>
        )}
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
          handleFunction={getChattingRoomList}
        />
      </Box>
    </Box>
  );
};

export default WaitingRoom;
