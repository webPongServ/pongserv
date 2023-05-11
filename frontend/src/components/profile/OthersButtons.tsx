import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import UserService from "API/UserService";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { FriendsActionTypes } from "types/redux/Friends";
import { ProfileDetail, UserDetail } from "types/Detail";
import { ProfileStatusType } from "constant";

import { Button } from "@mui/joy";

interface OthersButtonsProps {
  profileDetail: ProfileDetail;
  setProfileDetail: Function;
}

const OthersButtons = (props: OthersButtonsProps) => {
  const myInfo: UserDetail = useSelector((state: IRootState) => state.myInfo);
  const dispatch = useDispatch();

  const handleDMButton = () => {
    // const data = ... // 채팅방 생성 API 요청
    dispatch({
      type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
      payload: {
        id: "202304280001", // API를 통해 받아온 데이터
        chatroomName: `[DM] ${props.profileDetail!.nickname}, ${
          myInfo.nickname
        }`,
        ownerNickname: `${myInfo.nickname}`,
        type: "private",
        maxCount: 2,
        currentCount: 1,
      },
    });
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
        status: "login",
      },
    });
    props.setProfileDetail({
      ...props.profileDetail,
      status: ProfileStatusType.friend,
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
      status: ProfileStatusType.notFriend,
    });
  };

  const handleBlockButton = () => {};

  return (
    <>
      <Button variant="solid" onClick={handleDMButton}>
        DM
      </Button>
      {props.profileDetail.status === ProfileStatusType.friend ? (
        <Button variant="outlined" onClick={handleFriendDeleteButton}>
          친구 삭제
        </Button>
      ) : (
        <Button variant="solid" onClick={handleFriendAddButton}>
          친구 추가
        </Button>
      )}

      <Button variant="outlined" onClick={handleBlockButton}>
        차단
      </Button>
    </>
  );
};

export default OthersButtons;
