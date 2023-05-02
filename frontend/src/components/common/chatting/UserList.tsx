import { useState } from "react";
import CustomProfileButton from "components/common/utils/CustomProfileButton";
import { ChatUserDetail } from "types/Detail";
import "styles/global.scss";
import "styles/Chatting.scss";

import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface UserListProps {
  myDetail: ChatUserDetail;
}

const UserList = (props: UserListProps) => {
  const [users, setUsers] = useState<ChatUserDetail[]>([
    { nickname: "chanhyle", role: "owner", imgURL: "../image.png" },
    { nickname: "susong", role: "admin", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
    { nickname: "mgo", role: "normal", imgURL: "../image.png" },
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
    <>
      <List>
        {users.map((value, index) => (
          <ListItem key={value.nickname + index} disablePadding>
            <CustomProfileButton
              class="login"
              nickname={value.nickname}
              imgURL={value.imgURL}
              position="UserList"
              handleFunction={(e: any) => {
                setAnchorEl(e.currentTarget);
                handleContextMenu(e);
                setAmI(e.target.textContent === props.myDetail.nickname);
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
    </>
  );
};

export default UserList;
