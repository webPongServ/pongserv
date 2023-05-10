import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { FriendsActionTypes } from "types/redux/Friends";
import { ProfileDetail, UserDetail } from "types/Detail";

import { Button } from "@mui/joy";

interface OthersButtonsProps {
  isFriend: boolean;
  setIsFriend: Function;
  profileDetail: ProfileDetail;
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
        title: `[DM] ${props.profileDetail!.nickname}, ${myInfo.nickname}`,
        owner: `${myInfo.nickname}`,
        type: "private",
        max: 2,
        current: 1,
        createdAt: new Date(),
      },
    });
  };

  const handleFriendAddButton = () => {
    dispatch({
      type: FriendsActionTypes.FRIENDS_ADD,
      payload: {
        nickname: props.profileDetail!.nickname,
        imgURL: props.profileDetail!.imgURL,
        status: props.profileDetail!.status,
      },
    });
    props.setIsFriend(!props.isFriend);
  };

  const handleFriendDeleteButton = () => {
    dispatch({
      type: FriendsActionTypes.FRIENDS_DELETE,
      payload: props.profileDetail!.nickname,
    });
    props.setIsFriend(!props.isFriend);
  };

  const handleBlockButton = () => {};

  return (
    <>
      <Button variant="solid" onClick={handleDMButton}>
        DM
      </Button>
      <Button
        variant={props.isFriend ? "outlined" : "solid"}
        onClick={
          props.isFriend ? handleFriendDeleteButton : handleFriendAddButton
        }
      >
        {props.isFriend ? "친구 삭제" : "친구 추가"}
      </Button>
      <Button variant="outlined" onClick={handleBlockButton}>
        차단
      </Button>
    </>
  );
};

export default OthersButtons;
