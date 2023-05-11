import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import MainRoute from "components/common/MainRoute";
import AppBar from "components/common/AppBar";
import FriendDrawer from "components/common/FriendDrawer";
import ChattingDrawer from "components/common/ChattingDrawer";
import { ChattingDrawerWidth } from "constant";
import { useDispatch } from "react-redux";
import instance from "API/api";
import UserService from "API/UserService";
import { MyInfoActionTypes } from "types/redux/MyInfo";
import "styles/global.scss";

import { Box, CssBaseline } from "@mui/material";
import { styled } from "@mui/material/styles";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -ChattingDrawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

export default function AppHeader() {
  const [open, setOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  const loadMyData = async () => {
    const token = localStorage.getItem("accessToken");

    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await UserService.getMe();

    dispatch({
      type: MyInfoActionTypes.MYINFO_UPDATE,
      payload: {
        nickname: response.data.nickname,
        imgURL: response.data.imgPath,
        status: "login",
      },
    });
  };

  loadMyData();

  return (
    <Box id="AppHeader-container" className="flex-container">
      <CssBaseline />
      <AppBar open={open} setOpen={setOpen} />
      <FriendDrawer />
      <Main id="Main-box" open={open}>
        <Routes>
          <Route path="/*" element={<MainRoute />} />
        </Routes>
      </Main>
      <ChattingDrawer open={open} setOpen={setOpen} />
    </Box>
  );
}
