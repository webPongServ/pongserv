import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Person from "@mui/icons-material/Person";

type ChatRoomInfoProps = {
  id: string;
  title: string;
  owner: string;
  type: string;
  current: number;
  max: number;
  createdAt: Date;
  roomID: string;
  setRoomID: Function;
};

// 몇 시간 전에 생성되었는지 추가?
const RoomCard = (props: ChatRoomInfoProps) => {
  return (
    <Box
      onClick={() => {
        props.setRoomID(props.id);
      }}
      sx={{ cursor: "pointer" }}
    >
      <Card
        variant="outlined"
        className="chat-container chat-gap"
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
