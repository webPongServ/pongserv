import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import UserService from "API/UserService";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { FriendsActionTypes } from "types/redux/Friends";
import { ProfileDetail, UserDetail } from "types/Detail";
import {
  ProfileFriendType,
  ChattingRoomType,
  ChattingUserRoleType,
} from "constant";

import { Button } from "@mui/joy";

interface OthersButtonsProps {
  profileDetail: ProfileDetail;
  setProfileDetail: Function;
}

const OthersButtons = (props: OthersButtonsProps) => {
  const myInfo: UserDetail = useSelector((state: IRootState) => state.myInfo);
  const chattingSocket = useSelector(
    (state: IRootState) => state.sockets.chattingSocket
  );
  const dispatch = useDispatch();

  const handleDMButton = () => {
    chattingSocket.emit(
      "chatroomDirectMessage",
      { targetNickname: props.profileDetail!.nickname },
      (data: { chtrmId: string }) => {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
          payload: {
            id: data.chtrmId,
            chatroomName: `[DM] ${props.profileDetail!.nickname}, ${
              myInfo.nickname
            }`,
            ownerNickname: `${myInfo.nickname}`,
            type: ChattingRoomType.private,
            maxCount: 2,
            currentCount: 1,
            isAlrdyAttnd: false,
          },
        });
        dispatch({
          type: CurrentChattingActionTypes.ADD_MYDETAIL,
          payload: {
            nickname: myInfo.nickname,
            imgURL: myInfo.imgURL,
            role: ChattingUserRoleType.owner,
          },
        });
      }
    );
  };

  const handleFriendAddButton = async () => {
    const response = await UserService.postFriend({
      nickname: props.profileDetail!.nickname,
    });
    dispatch({
      type: FriendsActionTypes.FRIENDS_ADD,
      payload: {
        nickname: props.profileDetail!.nickname,
        imgURL: props.profileDetail!.imgURL,
        // login, logout인지 확인할 수 있는 것이 필요함
        status: response.data.isCurrStatus,
      },
    });
    props.setProfileDetail({
      ...props.profileDetail,
      status: ProfileFriendType.friend,
    });
  };

  const handleFriendDeleteButton = async () => {
    const response = await UserService.postDeleteFriend({
      nickname: props.profileDetail!.nickname,
    });
    dispatch({
      type: FriendsActionTypes.FRIENDS_DELETE,
      payload: props.profileDetail!.nickname,
    });
    props.setProfileDetail({
      ...props.profileDetail,
      status: ProfileFriendType.notFriend,
    });
  };

  const handleFriendBlockButton = () => {
    chattingSocket.emit(
      "putBlockingUserInChats",
      { nickname: props.profileDetail.nickname, boolToBlock: true }, // true : 차단, false : 차단 해제
      () => {
        props.setProfileDetail({
          ...props.profileDetail,
          isBlocked: true,
        });
      }
    );
  };

  const handleFriendUnblockButton = () => {
    chattingSocket.emit(
      "putBlockingUserInChats",
      { nickname: props.profileDetail.nickname, boolToBlock: false }, // true : 차단, false : 차단 해제
      () => {
        props.setProfileDetail({
          ...props.profileDetail,
          isBlocked: false,
        });
      }
    );
  };

  return (
    <>
      <Button variant="solid" onClick={handleDMButton}>
        DM
      </Button>
      {props.profileDetail.status === ProfileFriendType.friend ? (
        <Button variant="outlined" onClick={handleFriendDeleteButton}>
          친구 삭제
        </Button>
      ) : (
        <Button variant="solid" onClick={handleFriendAddButton}>
          친구 추가
        </Button>
      )}
      {props.profileDetail.isBlocked ? (
        <Button variant="solid" onClick={handleFriendUnblockButton}>
          메시지 차단 해제
        </Button>
      ) : (
        <Button variant="outlined" onClick={handleFriendBlockButton}>
          메시지 차단
        </Button>
      )}
    </>
  );
};

export default OthersButtons;
