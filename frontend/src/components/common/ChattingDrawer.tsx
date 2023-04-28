import { useState } from "react";
import { useSelector } from "react-redux";
import { ChattingDrawerWidth } from "constant";
import { IRootState } from "components/common/store";
import "styles/global.scss";
import "styles/Chatting.scss";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import WaitingRoom from "components/common/chatting/WaitingRoom";
import ChattingRoom from "components/common/chatting/ChattingRoom";
import RoomCreator from "components/common/chatting/RoomCreator";

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
  const currentChatting = useSelector(
    (state: IRootState) => state.currentChatting
  );

  const theme = useTheme();

  const handleDrawerClose = () => {
    props.setOpen(false);
  };

  return (
    <Drawer
      sx={{
        width: ChattingDrawerWidth,
        height: "100%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: ChattingDrawerWidth,
        },
      }}
      variant="persistent"
      anchor="right"
      open={props.open}
    >
      <DrawerHeader sx={{ height: "8%" }}>
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
      {currentChatting.status === "waiting" && <WaitingRoom />}
      {currentChatting.status === "creating" && <RoomCreator />}
      {currentChatting.status === "chatting" && <ChattingRoom />}
    </Drawer>
  );
};

export default ChattingDrawer;
