import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomProfileButton from "components/utils/CustomProfileButton";
import { ChattingUserDetail } from "types/Detail";
import EmptyListMessage from "components/utils/EmptyListMessage";
import {
  CurrentChatting,
  CurrentChattingActionTypes,
} from "types/redux/CurrentChatting";
import ChattingService from "API/ChattingService";
import { IRootState } from "components/common/store";
import { ChattingUserRoleType, GameDifficultyType } from "constant";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";
import { ChatObject } from "components/common/chatting/ChattingRoom";
import { CurrentGameActionTypes } from "types/redux/CurrentGame";

import { Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface UserListProps {
  myDetail: ChattingUserDetail;
  chatting: ChatObject[];
  setChatting: Function;
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
  const chattingSocket: any = useSelector(
    (state: IRootState) => state.sockets.chattingSocket!
  );
  const myInfo = useSelector((state: IRootState) => state.myInfo);
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
  const navigate = useNavigate();

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

  const handleProfile = () => {
    navigate(`/profile/${selectedUser.nickname}`);
    setAnchorEl(null);
  };

  const handleKick = () => {
    chattingSocket.emit(
      "chatroomKick",
      {
        id: currentChatting.chattingRoom?.id,
        nicknameToKick: selectedUser.nickname,
      },
      () => {
        // 1. 여기서 currentChatting.userlist 다시 렌더링하기 => 자동으로 구독되어 렌더링이 되는데
        // 2. dispatch할 때, payload가 맞지 않아도 에러가 발생하지 않는 것에 주의(redux 상태 변경 실패)
        // 지금은 강퇴한 사람한테만 보임
        props.setChatting([
          ...props.chatting,
          {
            user: null,
            message: selectedUser.nickname + "님이 강제 퇴장되었습니다.",
          },
        ]);
        dispatch({
          type: CurrentChattingActionTypes.DELETE_USERLIST,
          payload: selectedUser.nickname,
        });
        setAnchorEl(null);
      }
    );
  };

  const handleBan = () => {
    chattingSocket.emit(
      "chatroomRegisterBan",
      {
        id: currentChatting.chattingRoom?.id,
        nicknameToBan: selectedUser.nickname,
      },
      () => {
        dispatch({
          type: CurrentChattingActionTypes.DELETE_USERLIST,
          payload: selectedUser.nickname,
        });
        dispatch({
          type: CurrentChattingActionTypes.ADD_BANLIST,
          payload: selectedUser,
        });
        setAnchorEl(null);
      }
    );
  };

  const handleMute = () => {
    chattingSocket.emit(
      "chatroomMute",
      {
        id: currentChatting.chattingRoom?.id,
        nicknameToMute: selectedUser.nickname,
      },
      () => {
        setAnchorEl(null);
      }
    );
  };

  const handleEmpowerment = () => {
    chattingSocket.emit(
      "chatroomEmpowerment",
      {
        id: currentChatting.chattingRoom?.id,
        nicknameToEmpower: selectedUser.nickname,
      },
      () => {
        setAnchorEl(null);
      }
    );
  };

  const handleRequestGame = () => {
    chattingSocket.emit(
      "chatroomRequestGame",
      {
        id: currentChatting.chattingRoom?.id,
        targetNickname: selectedUser.nickname,
      },
      (gmRmId: string) => {
        dispatch({
          type: CurrentGameActionTypes.UPDATE_GAMEROOM,
          payload: {
            id: gmRmId,
            title: myInfo.nickname + "의 신청 게임",
            owner: myInfo.nickname,
            ownerImage: myInfo.imgURL,
            maxScore: 5,
            difficulty: GameDifficultyType.normal,
          },
        });
        setAnchorEl(null);
        navigate(`/game/${uuid}`);
      }
    );
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
            <MenuItem onClick={handleRequestGame}>대결 신청</MenuItem>
          )}
        {!(selectedUser.nickname === props.myDetail.nickname) &&
          props.myDetail.role !== ChattingUserRoleType.normal && (
            <Box>
              <MenuItem onClick={handleProfile}>프로필 보기</MenuItem>
              <MenuItem onClick={handleEmpowerment}>관리자 권한 부여</MenuItem>
              <MenuItem onClick={handleMute}>벙어리</MenuItem>
              <MenuItem onClick={handleKick}>채팅방 내보내기</MenuItem>
              <MenuItem onClick={handleBan}>채팅방 차단</MenuItem>
              <MenuItem onClick={handleRequestGame}>대결 신청</MenuItem>
            </Box>
          )}
      </Menu>
    </>
  );
};

export default UserList;
