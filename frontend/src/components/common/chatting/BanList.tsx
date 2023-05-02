import { useState } from "react";
import { ChatUserDetail } from "types/Detail";
import CustomProfileButton from "components/common/utils/CustomProfileButton";
import "styles/global.scss";
import "styles/Chatting.scss";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface BanListProps {
  myDetail: ChatUserDetail;
}

const BanList = (props: BanListProps) => {
  const [bans, setBans] = useState<ChatUserDetail[]>([
    { nickname: "noname_12", role: "normal", imgURL: "../image.png" },
    { nickname: "seongtki", role: "admin", imgURL: "../image.png" },
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
    <>
      <List>
        {bans.map((value, index) => (
          <ListItem key={value.nickname + index} disablePadding>
            <CustomProfileButton
              class="login"
              nickname={value.nickname}
              imgURL={value.imgURL}
              position="UserList"
              handleFunction={(e: any) => {
                setAnchorEl(e.currentTarget);
                handleContextMenu(e);
              }}
            />
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
    </>
  );
};

export default BanList;
