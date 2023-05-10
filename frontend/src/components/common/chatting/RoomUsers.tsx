import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserList from "components/common/chatting/UserList";
import BanList from "components/common/chatting/BanList";
import CustomIconButton from "components/common/utils/CustomIconButton";
import { ChattingUserDetail } from "types/Detail";
import ChattingService from "API/ChattingService";
import { IRootState } from "components/common/store";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import CloseIcon from "@mui/icons-material/Close";

type RoomUsersProps = {
  myDetail: ChattingUserDetail;
  setRoomStatus: Function;
};

const RoomUsers = (props: RoomUsersProps) => {
  const currentChatting = useSelector(
    (state: IRootState) => state.currentChatting
  );
  const [selected, setSelected] = useState<string>("users");
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const pressESC = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      props.setRoomStatus("chat");
    }
  };

  const getUsers = async () => {
    const response = await ChattingService.getUsersList(
      currentChatting.chattingRoom.id
    );
    dispatch({
      type: CurrentChattingActionTypes.GET_USERLIST,
      payload: response.data,
    });
    dispatch({
      type: CurrentChattingActionTypes.GET_BANLIST,
      payload: [],
    });
  };

  useEffect(() => {
    if (divRef.current) divRef.current.focus();
    getUsers();
  }, []);

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
              users={currentChatting.userList}
              bans={currentChatting.banList}
              myDetail={props.myDetail}
            />
          ) : (
            <BanList
              bans={currentChatting.banList}
              users={currentChatting.userList}
              myDetail={props.myDetail}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RoomUsers;
