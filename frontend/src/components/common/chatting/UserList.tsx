import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CustomProfileButton from "components/utils/CustomProfileButton";
import { ChattingUserDetail } from "types/Detail";
import EmptyListMessage from "components/utils/EmptyListMessage";
import {
  CurrentChatting,
  CurrentChattingActionTypes,
} from "types/redux/CurrentChatting";
import ChattingService from "API/ChattingService";
import { IRootState } from "components/common/store";
import { ChattingUserRoleType } from "constant";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface UserListProps {
  myDetail: ChattingUserDetail;
}

interface serverChattingUserDetail {
  nickname: string;
  imgPath: string;
  authInChtrm: string;
}

const UserList = (props: UserListProps) => {
  const currentChatting: CurrentChatting = useSelector(
    (state: IRootState) => state.currentChatting
  );
  const [selectedUser, setSelectedUser] = useState<ChattingUserDetail>({
    nickname: "",
    imgURL: "",
    role: ChattingUserRoleType.normal,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

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

  const getUserList = async () => {
    const response = await ChattingService.getUsersList(
      currentChatting.chattingRoom!.id
    );
    console.log(response.data);
    dispatch({
      type: CurrentChattingActionTypes.GET_USERLIST,
      payload: response.data.map(
        (value: serverChattingUserDetail): ChattingUserDetail => ({
          ...value,
          imgURL: value.imgPath,
          role: value.authInChtrm,
        })
      ),
    });
  };

  useEffect(() => {
    getUserList();
  }, []);

  return currentChatting.userList.length === 0 ? (
    <EmptyListMessage message="채팅 중인 사용자가 없습니다!" />
  ) : (
    <>
      <List>
        {currentChatting.userList.map((value, index) => (
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
        {selectedUser.nickname === props.myDetail.nickname && (
          <MenuItem>내 계정</MenuItem>
        )}
        {!(selectedUser.nickname === props.myDetail.nickname) &&
          props.myDetail.role === ChattingUserRoleType.normal && (
            <MenuItem>대결 신청</MenuItem>
          )}
        {!(selectedUser.nickname === props.myDetail.nickname) &&
          props.myDetail.role !== ChattingUserRoleType.normal && (
            <Box>
              <MenuItem>채팅방 내보내기</MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch({
                    type: CurrentChattingActionTypes.DELETE_USERLIST,
                    payload: currentChatting.userList.filter(
                      (value) => value.nickname !== selectedUser.nickname
                    ),
                  });
                  dispatch({
                    type: CurrentChattingActionTypes.ADD_BANLIST,
                    payload: selectedUser,
                  });
                  setAnchorEl(null);
                }}
              >
                채팅방 차단
              </MenuItem>
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
