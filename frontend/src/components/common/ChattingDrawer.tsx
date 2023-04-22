import { useState } from "react";
import { ChattingDrawerWidth } from "constant";
import "styles/global.scss";
import "styles/Chatting.scss";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import WaitingRoom from "./chatting/WaitingRoom";
import ChattingRoom from "./chatting/ChattingRoom";

type HandleOpen = { open: boolean; setOpen: Function };

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const ChattingDrawer = (props: HandleOpen) => {
  const [roomID, setRoomID] = useState<number>(0);

  const theme = useTheme();

  const handleDrawerClose = () => {
    props.setOpen(false);
  };

  return (
    <Drawer
      sx={{
        width: ChattingDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: ChattingDrawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={props.open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
        <div style={{ flexGrow: 1, justifyContent: "center" }}>
          <div className="flex-container">
            <div style={{ fontSize: "20px" }}>채팅</div>
          </div>
        </div>
      </DrawerHeader>
      <Divider />
      {roomID === 0 ? (
        <WaitingRoom roomID={roomID} setRoomID={setRoomID} />
      ) : (
        <ChattingRoom roomID={roomID} setRoomID={setRoomID} />
      )}
    </Drawer>
  );
};

export default ChattingDrawer;
