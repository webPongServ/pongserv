import { IRootState } from "components/common/store";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChattingRoomDetail } from "types/Detail";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";
import { ChattingRoomType } from "constant";

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
  const currentChatting = useSelector(
    (state: IRootState) => state.currentChatting
  );
  const dispatch = useDispatch();

  return (
    <Card
      id="card"
      variant="outlined"
      onClick={() => {
        props.room.type === ChattingRoomType.protected
          ? props.setPwIndex(props.index)
          : dispatch({
              type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
              payload: {
                id: props.room.id,
                chatroomName: props.room.chatroomName,
                ownerNickname: props.room.ownerNickname,
                type: props.room.type,
                currentCount: props.room.currentCount,
                maxCount: props.room.maxCount,
              },
            });
      }}
    >
      <Box className="title">
        <b>{props.room.chatroomName}</b>
      </Box>
      <Box className="content">
        <Box className="flex-container">
          <StarBorderIcon />
          {props.room.ownerNickname}
        </Box>
        <Box>|</Box>
        <Box className="flex-container">
          <Person />
          {props.room.currentCount} / {props.room.maxCount}
        </Box>
        <Box>|</Box>
        <Box>
          {props.room.type === ChattingRoomType.public && "공개"}
          {props.room.type === ChattingRoomType.protected && "비공개"}
          {props.room.type === ChattingRoomType.private && "DM"}
        </Box>
      </Box>
    </Card>
  );
};

export default RoomCard;
