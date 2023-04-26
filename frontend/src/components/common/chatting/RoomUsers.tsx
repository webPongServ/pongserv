import { useState, useRef, useEffect } from "react";

import { Box } from "@mui/material";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import "styles/global.scss";
import "styles/Chatting.scss";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type HandleRoomDetail = {
  setRoomStatus: Function;
};

const RoomUsers = (props: HandleRoomDetail) => {
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
    <>
      <Box
        className="flex-container"
        sx={{ height: "10%" }}
        onKeyDown={pressESC}
        tabIndex={0}
        ref={divRef}
      >
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
        <IconButton
          sx={{ marginLeft: "auto" }}
          onClick={() => {
            props.setRoomStatus("chat");
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        className="flex-container align-normal justify-normal"
        sx={{
          flexDirection: "column",
          height: "90%",
          gap: 3,
          marginTop: "5%",
        }}
      >
        <Box
          sx={{
            height: "100%",
            p: 1,
            overflow: "auto",
          }}
          className="users-box"
        >
          {selected === "users" ? (
            <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
              유저 목록입니다.
            </Box>
          ) : (
            <Box sx={{ p: 3, height: "100%", overflow: "auto" }}>
              차단 목록입니다.
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default RoomUsers;
