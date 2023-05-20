import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserList from "components/common/chatting/UserList";
import BanList from "components/common/chatting/BanList";
import CustomIconButton from "components/utils/CustomIconButton";
import { ChattingUserDetail, ChattingRoomDetail } from "types/Detail";
import { IRootState } from "components/common/store";
import { ChatObject } from "components/common/chatting/ChattingRoom";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import CloseIcon from "@mui/icons-material/Close";

interface RoomUsersProps {
  myDetail: ChattingUserDetail;
  setRoomStatus: Function;
  chatting: ChatObject[];
  setChatting: Function;
}

const RoomUsers = (props: RoomUsersProps) => {
  // const currentChatting: ChattingRoomDetail | null = useSelector(
  //   (state: IRootState) => state.currentChatting.chattingRoom
  // );
  const [selected, setSelected] = useState<string>("users");
  const divRef = useRef<HTMLDivElement>(null);
  // const dispatch = useDispatch();

  const pressESC = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      props.setRoomStatus("chat");
    }
  };

  useEffect(() => {
    if (divRef.current) divRef.current.focus();
  }, [selected]);

  return (
    <Box id="modal" ref={divRef} onKeyDown={pressESC} tabIndex={0}>
      <Box className="modal-header flex-container">
        <b>유저 / 차단 목록</b>
        <CustomIconButton
          class="red"
          icon={<CloseIcon />}
          handleFunction={() => {
            props.setRoomStatus("chat");
          }}
        />
      </Box>
      <Box className="modal-body flex-container">
        <Box>
          <Select defaultValue={selected}>
            <Option
              value="users"
              onClick={() => {
                setSelected("users");
              }}
            >
              유저 목록
            </Option>
            <Option
              value="bans"
              onClick={() => {
                setSelected("bans");
              }}
            >
              차단 목록
            </Option>
          </Select>
        </Box>
        <Box className="users-box overflow">
          {selected === "users" ? (
            <UserList
              myDetail={props.myDetail}
              chatting={props.chatting}
              setChatting={props.setChatting}
            />
          ) : (
            <BanList myDetail={props.myDetail} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RoomUsers;
