import { IRootState } from "components/common/store";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingTypes } from "types/CurrentChatting";
import { ChatRoomDetail } from "types/Detail";

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
    <Box
      onClick={() => {
        dispatch({
          type: CurrentChattingTypes.UPDATE_STATUS_CHATTING,
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
      sx={{ cursor: "pointer" }}
    >
      <Card
        variant="outlined"
        className="chat-gap"
        sx={{
          "&:hover": { border: "3px solid skyblue" },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography level="h1" fontSize="md" sx={{ mb: 0.5 }}>
            {props.title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            py: 1,
            alignItems: "center",
            height: "32px",
          }}
        >
          <StarBorderIcon />
          <Typography level="body1">{props.owner}</Typography>
          <Typography sx={{ color: "#aaaaaa" }}>|</Typography>
          <Person />
          <Typography
            level="body1"
            sx={{ fontWeight: "md", color: "text.secondary" }}
          >
            {props.current} / {props.max}
          </Typography>
        </Box>
        <CardOverflow
          variant="soft"
          sx={{
            display: "flex",
            gap: 1.5,
            py: 1,
            px: "var(--Card-padding)",
            bgcolor: "background.level1",
          }}
        >
          <Typography sx={{ color: "#aaaaaa" }}>
            {props.type === "public" && "공개"}
            {props.type === "protected" && "비공개"}
            {props.type === "private" && "DM"}
          </Typography>
          <Typography sx={{ color: "#aaaaaa" }}>|</Typography>
          <Typography sx={{ color: "#aaaaaa" }}>9 hours ago</Typography>
        </CardOverflow>
      </Card>
    </Box>
  );
};

export default RoomCard;
