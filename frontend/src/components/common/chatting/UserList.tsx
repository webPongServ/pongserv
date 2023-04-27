import { useState } from "react";
import { MyDetail } from "./ChattingRoom";
import "styles/global.scss";
import "styles/Chatting.scss";

import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export interface ChatUserDetail {
  nickname: string;
  role: string;
  imgUrl: string;
}

interface UserListProps {
  myDetail: MyDetail;
}

const UserList = (props: UserListProps) => {
  const [users, setUsers] = useState<ChatUserDetail[]>([
    { nickname: "chanhyle", role: "owner", imgUrl: "../image.png" },
    { nickname: "susong", role: "admin", imgUrl: "../image.png" },
    { nickname: "mgo", role: "normal", imgUrl: "../image.png" },
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const open = Boolean(anchorEl);
  const [amI, setAmI] = useState<boolean>(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 1, height: "100%", overflow: "auto" }}>
      <List sx={{ height: "80%", overflow: "auto" }}>
        {users.map((value, index) => (
          <ListItem
            key={value.nickname + index}
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: true ? "initial" : "center",
                px: 2.5,
              }}
              // what?
              onClick={(e: any) => {
                setAnchorEl(e.currentTarget);
                handleContextMenu(e);
                setAmI(e.target.textContent === props.myDetail.nickname);
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: true ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <AccountCircleIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={value.nickname}
                sx={{ opacity: true ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        {amI && <MenuItem>내 계정</MenuItem>}
        {!amI && props.myDetail.role === "normal" && (
          <MenuItem>대결 신청</MenuItem>
        )}
        {!amI && props.myDetail.role !== "normal" && (
          <Box>
            <MenuItem>채팅방 내보내기</MenuItem>
            <MenuItem>채팅방 차단</MenuItem>
            <MenuItem>벙어리</MenuItem>
            <MenuItem>관리자 권한 부여</MenuItem>
            <MenuItem>대결 신청</MenuItem>
          </Box>
        )}
      </Menu>
    </Box>
  );
};

export default UserList;
