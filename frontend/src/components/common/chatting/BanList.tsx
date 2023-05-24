import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChattingUserDetail } from "types/Detail";
import {
  CurrentChatting,
  CurrentChattingActionTypes,
} from "types/redux/CurrentChatting";
import ChattingService from "API/ChattingService";
import { IRootState } from "components/common/store";
import CustomProfileButton from "components/utils/CustomProfileButton";
import EmptyListMessage from "components/utils/EmptyListMessage";
import { ChattingUserRoleType } from "constant";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box, List, ListItem, Menu, MenuItem } from "@mui/material";

interface BanListProps {
  myDetail: ChattingUserDetail;
}

interface serverChattingUserDetail {
  nickname: string;
  imgPath: string;
  authInChtrm: string;
}

const BanList = (props: BanListProps) => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const currentChatting: CurrentChatting = useSelector(
    (state: IRootState) => state.currentChatting
  );
  const chattingSocket: any = useSelector(
    (state: IRootState) => state.sockets.chattingSocket!
  );
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

  const [selectedUser, setSelectedUser] = useState<ChattingUserDetail>({
    nickname: "",
    imgURL: "",
    role: ChattingUserRoleType.normal,
  });

  const getBansList = async () => {
    const response = await ChattingService.getBansList(
      currentChatting.chattingRoomDetail!.id
    );
    dispatch({
      type: CurrentChattingActionTypes.GET_BANLIST,
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
    getBansList();
  }, [myInfo]);

  return currentChatting.banList.length === 0 ? (
    <EmptyListMessage message="차단한 사용자가 없습니다!" />
  ) : (
    <>
      <List>
        {currentChatting.banList.map((value, index) => (
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
        {props.myDetail.role === ChattingUserRoleType.normal ? (
          <Box>권한이 없습니다.</Box>
        ) : (
          <MenuItem
            onClick={() => {
              chattingSocket.emit(
                "chatroomRemovalBan",
                {
                  id: currentChatting.chattingRoomDetail?.id,
                  nicknameToFree: selectedUser.nickname,
                },
                () => {
                  dispatch({
                    type: CurrentChattingActionTypes.DELETE_BANLIST,
                    payload: selectedUser.nickname,
                  });
                  setAnchorEl(null);
                }
              );
            }}
          >
            채팅방 차단 해제
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default BanList;
