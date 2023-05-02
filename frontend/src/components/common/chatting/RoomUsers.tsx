import { useState, useRef, useEffect } from "react";
import UserList from "components/common/chatting/UserList";
import BanList from "components/common/chatting/BanList";
import CustomIconButton from "components/common/utils/CustomIconButton";
import { ChatUserDetail } from "types/Detail";
import "styles/global.scss";
import "styles/Chatting.scss";

import { Box } from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import CloseIcon from "@mui/icons-material/Close";

type RoomUsersProps = {
  myDetail: ChatUserDetail;
  setRoomStatus: Function;
};

const RoomUsers = (props: RoomUsersProps) => {
  const [selected, setSelected] = useState<string>("users");
  const divRef = useRef<HTMLDivElement>(null);

  const pressESC = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      props.setRoomStatus("chat");
    }
  };

  useEffect(() => {
    if (divRef.current) divRef.current.focus();
  }, []);

  return (
    <Box id="modal" ref={divRef} onKeyDown={pressESC} tabIndex={0}>
      <Box className="modal-header flex-container">
        <Select
          defaultValue={selected}
          // onChange={(e) => {
          //   if (e) {
          //     const target: HTMLInputElement = e.target as HTMLInputElement;
          //     props.setPartyForm({
          //       ...props.partyForm,
          //       category: target.outerText,
          //     });
          //   }
          // }}
        >
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
        <CustomIconButton
          class="red"
          icon={<CloseIcon />}
          handleFunction={() => {
            props.setRoomStatus("chat");
          }}
        />
      </Box>
      <Box className="modal-body flex-container users-box overflow">
        {selected === "users" ? (
          <UserList myDetail={props.myDetail} />
        ) : (
          <BanList myDetail={props.myDetail} />
        )}
      </Box>
    </Box>
  );
};

export default RoomUsers;
