import { useState } from "react";
import { ChatUserDetail } from "types/Detail";
import CustomProfileButton from "components/common/utils/CustomProfileButton";
import EmptyListMessage from "components/common/utils/EmptyListMessage";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface BanListProps {
  bans: ChatUserDetail[];
  users: ChatUserDetail[];
  setUsers: Function;
  setBans: Function;
  myDetail: ChatUserDetail;
}

const BanList = (props: BanListProps) => {
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

  const [selectedUser, setSelectedUser] = useState<ChatUserDetail>({
    nickname: "",
    imgURL: "",
    role: "normal",
  });

  return props.bans.length === 0 ? (
    <EmptyListMessage message="차단한 사용자가 없습니다!" />
  ) : (
    <>
      <List>
        {props.bans.map((value, index) => (
          <ListItem key={value.nickname + index} disablePadding>
            <CustomProfileButton
              class="login"
              nickname={value.nickname}
              imgURL={value.imgURL}
              position="UserList"
              handleFunction={(e: any) => {
                setAnchorEl(e.currentTarget);
                handleContextMenu(e);
                setSelectedUser(value);
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
        <MenuItem
          onClick={() => {
            props.setUsers([...props.users, selectedUser]);
            props.setBans(
              props.bans.filter(
                (value) => value.nickname !== selectedUser.nickname
              )
            );
          }}
        >
          채팅방 차단 해제
        </MenuItem>
      </Menu>
    </>
  );
};

export default BanList;
