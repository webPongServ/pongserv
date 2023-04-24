import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import MainRoute from "components/common/MainRoute";
import AppBar from "./AppBar";
import FriendDrawer from "./FriendDrawer";
import ChattingDrawer from "./ChattingDrawer";
import { ChattingDrawerWidth } from "constant";
import "styles/global.scss";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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

  return (
    <Box className="flex-container">
      <CssBaseline />
      <AppBar open={open} setOpen={setOpen} />
      <FriendDrawer />
      <Main open={open}>
        <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
          <Routes>
            <Route path="/*" element={<MainRoute />} />
          </Routes>
        </Box>
      </Main>
      <ChattingDrawer open={open} setOpen={setOpen} />
    </Box>
  );
}
