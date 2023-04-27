import { useState } from "react";
import "styles/global.scss";
import "styles/Chatting.scss";
import { UserDetail } from "./UserList";
import { MyDetail } from "./ChattingRoom";

import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface BanDetail {
  nickname: string;
  role: string;
  imgUrl: string;
}

interface BanListProps {
  myDetail: MyDetail;
}

const BanList = (props: BanListProps) => {
  const [bans, setBans] = useState<BanDetail[]>([
    { nickname: "noname_12", role: "normal", imgUrl: "../image.png" },
    { nickname: "seongtki", role: "admin", imgUrl: "../image.png" },
  ]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const open = Boolean(anchorEl);

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
        {bans.map((value, index) => (
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
        <MenuItem>채팅방 차단 해제</MenuItem>
      </Menu>
    </Box>
  );
};

export default BanList;
