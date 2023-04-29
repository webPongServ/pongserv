import { IRootState } from "components/common/store";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChatRoomDetail } from "types/Detail";
import "styles/global.scss";
import "styles/Chatting.scss";

import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Person from "@mui/icons-material/Person";

const RoomCard = (props: ChatRoomDetail) => {
  const currentChatting = useSelector(
    (state: IRootState) => state.currentChatting
  );
  const dispatch = useDispatch();

  return (
    <Card
      id="card"
      variant="outlined"
      onClick={() => {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
          payload: {
            id: props.id,
            title: props.title,
            owner: props.owner,
            type: props.type,
            current: props.current,
            max: props.max,
            createdAt: props.createdAt,
          },
        });
      }}
    >
      <Box className="title">
        <b>{props.title}</b>
      </Box>
      <Box className="content">
        <Box className="flex-container">
          <StarBorderIcon />
          {props.owner}
        </Box>
        <Typography sx={{ color: "#aaaaaa" }}>|</Typography>
        <Box className="flex-container">
          <Person />
          {props.current} / {props.max}
        </Box>
      </Box>
      <CardOverflow className="card-overflow" variant="soft">
        <Typography sx={{ color: "#aaaaaa" }}>
          {props.type === "public" && "공개"}
          {props.type === "protected" && "비공개"}
          {props.type === "private" && "DM"}
        </Typography>
        <Typography sx={{ color: "#aaaaaa" }}>|</Typography>
        <Typography sx={{ color: "#aaaaaa" }}>9 hours ago</Typography>
      </CardOverflow>
    </Card>
  );
};

export default RoomCard;
