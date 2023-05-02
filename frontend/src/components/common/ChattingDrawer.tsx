import { useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "components/common/store";
import CustomIconButton from "components/common/utils/CustomIconButton";
import "styles/global.scss";
import "styles/Chatting.scss";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import { Box, Divider } from "@mui/material";

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
      id="ChattingDrawer"
      variant="persistent"
      anchor="right"
      open={props.open}
    >
      <DrawerHeader id="header">
        <CustomIconButton
          class=""
          icon={
            theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )
          }
          handleFunction={handleDrawerClose}
        />
        <Box id="title" className="flex-container">
          채팅
        </Box>
      </DrawerHeader>
      <Divider />
      <Box id="body">
        {currentChatting.status === "waiting" && <WaitingRoom />}
        {currentChatting.status === "creating" && <RoomCreator />}
        {currentChatting.status === "chatting" && <ChattingRoom />}
      </Box>
    </Drawer>
  );
};

export default ChattingDrawer;
