import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "components/common/store";
import CustomIconButton from "components/utils/CustomIconButton";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChattingRoomDetail } from "types/Detail";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

interface RoomLeaveProps {
  setRoomStatus: Function;
}

const RoomLeave = (props: RoomLeaveProps) => {
  const chattingRoom: ChattingRoomDetail = useSelector(
    (state: IRootState) => state.currentChatting.chattingRoom!
  );
  const chattingSocket: any = useSelector(
    (state: IRootState) => state.sockets.chattingSocket!
  );
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const pressESC = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      props.setRoomStatus("chat");
    }
  };

  const handleLeaveRoom = async () => {
    chattingSocket.emit(
      "chatroomLeaving",
      { id: chattingRoom.id },
      (response: any) => {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_STATUS_WAITING,
          payload: "",
        });
      }
    );
  };

  useEffect(() => {
    if (divRef.current) divRef.current.focus();
  }, []);

  return (
    <Box id="modal" ref={divRef} onKeyDown={pressESC} tabIndex={0}>
      <Box className="modal-header flex-container">
        <b>채팅방 퇴장</b>
        <CustomIconButton
          class="red"
          icon={<CloseIcon />}
          handleFunction={() => {
            props.setRoomStatus("chat");
          }}
        />
      </Box>
      <Box className="modal-body message flex-container">
        <b>현재 채팅방에서 퇴장하시겠습니까?</b>
      </Box>
      <Box className="modal-footer flex-container">
        <Button onClick={handleLeaveRoom}>퇴장</Button>
      </Box>
    </Box>
  );
};

export default RoomLeave;
