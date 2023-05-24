import { IRootState } from "components/common/store";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChattingRoomDetail } from "types/Detail";
import { ChattingRoomType, ChattingUserRoleType } from "constant";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Person from "@mui/icons-material/Person";

interface RoomCardProps {
  room: ChattingRoomDetail;
  index: number;
  setPwIndex: Function;
  key: string;
}

const RoomCard = (props: RoomCardProps) => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const chattingSocket: any = useSelector(
    (state: IRootState) => state.sockets.chattingSocket!
  );
  const dispatch = useDispatch();

  const handleCardClick = async () => {
    if (props.room.type === ChattingRoomType.protected)
      props.setPwIndex(props.index);
    else {
      chattingSocket.emit(
        "chatroomEntrance",
        { id: props.room.id, pwd: "" },
        (authInChtrm: string) => {
          dispatch({
            type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
            payload: {
              id: props.room.id,
              chatroomName: props.room.chatroomName,
              ownerNickname: props.room.ownerNickname,
              type: props.room.type,
              currentCount: props.room.currentCount,
              maxCount: props.room.maxCount,
              isAlrdyAttnd: props.room.isAlrdyAttnd,
            },
          });
          dispatch({
            type: CurrentChattingActionTypes.ADD_MYDETAIL,
            payload: {
              nickname: myInfo.nickname,
              imgURL: myInfo.imgURL,
              role: authInChtrm,
            },
          });
        }
      );
    }
  };

  return (
    <Card id="card" variant="outlined" onClick={handleCardClick}>
      <Box className="title">
        <b>{props.room.chatroomName}</b>
      </Box>
      <Box className="content">
        <Box className="flex-container">
          <StarBorderIcon />
          {props.room.ownerNickname}
        </Box>
        <Box className="divider">|</Box>
        <Box className="flex-container">
          <Person />
          {props.room.currentCount} / {props.room.maxCount}
        </Box>
        <Box className="divider">|</Box>
        <Box>
          {props.room.type === ChattingRoomType.public && "공개"}
          {props.room.type === ChattingRoomType.protected && "비공개"}
          {props.room.type === ChattingRoomType.private && "DM"}
        </Box>
        <Box className="divider">{props.room.isAlrdyAttnd && "|"}</Box>
        <Box>{props.room.isAlrdyAttnd && "참여 중"}</Box>
      </Box>
    </Card>
  );
};

export default RoomCard;
