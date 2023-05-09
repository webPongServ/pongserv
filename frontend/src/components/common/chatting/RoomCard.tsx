import { IRootState } from "components/common/store";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChattingRoomDetail } from "types/Detail";
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
        props.room.type === "protected"
          ? props.setPwIndex(props.index)
          : dispatch({
              type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
              payload: {
                id: props.room.id,
                title: props.room.title,
                owner: props.room.owner,
                type: props.room.type,
                current: props.room.current,
                max: props.room.max,
                createdAt: props.room.createdAt,
              },
            });
      }}
    >
      <Box className="title">
        <b>{props.room.title}</b>
      </Box>
      <Box className="content">
        <Box className="flex-container">
          <StarBorderIcon />
          {props.room.owner}
        </Box>
        <Box>|</Box>
        <Box className="flex-container">
          <Person />
          {props.room.current} / {props.room.max}
        </Box>
        <Box>|</Box>
        <Box>
          {props.room.type === "public" && "공개"}
          {props.room.type === "protected" && "비공개"}
          {props.room.type === "private" && "DM"}
        </Box>
      </Box>
    </Card>
  );
};

export default RoomCard;
