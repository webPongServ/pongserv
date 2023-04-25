import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/system";
import "styles/Game.scss";
import "styles/global.scss";

interface GameCardProps {
  id: string;
  title: string;
  owner: string;
  maxScore: number;
  difficulty: string;
  createdAt: Date;
  setRoomStatus: Function;
  setSelectedID: Function;
}

const GameCard = (props: GameCardProps) => {
  return (
    <Box
      onClick={() => {
        props.setRoomStatus("normal-game");
        props.setSelectedID(props.id);
      }}
      sx={{ cursor: "pointer" }}
    >
      <Card
        variant="outlined"
        sx={{
          width: 250,
          height: 250,
          "&:hover": { border: "3px solid skyblue" },
        }}
      >
        <Box className="flex-container outframe" sx={{ height: 150, gap: 3 }}>
          <Box
            className=" flex-container direction-column game-image"
            sx={{ gap: 1 }}
          >
            <img src="../image.png" alt="game_img" />
            <Typography level="body2">{props.owner}</Typography>
          </Box>
          <div className="sword">
            <img src="../swords.png" alt="sword_img" />
          </div>
          <Box
            className=" flex-container direction-column game-image"
            sx={{ gap: 1 }}
          >
            <img src="../question.png" alt="game_img" />
            <Typography level="body2" sx={{ color: "white" }}>
              opponent
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: 60 }}>
          <Typography level="h2" sx={{ fontSize: "md", mt: 2 }}>
            {props.title}
          </Typography>
        </Box>
        <Divider />
        <CardOverflow
          variant="soft"
          sx={{
            height: 40,
            display: "flex",
            gap: 1.5,
            py: 1.5,
            px: "var(--Card-padding)",
            bgcolor: "background.level1",
          }}
        >
          <Typography
            level="body3"
            sx={{ fontWeight: "md", color: "text.secondary" }}
          >
            점수 : {props.maxScore}
          </Typography>
          <Divider orientation="vertical" />
          <Typography
            level="body3"
            sx={{ fontWeight: "md", color: "text.secondary" }}
          >
            난이도 : {props.difficulty === "easy" && "쉬움"}
            {props.difficulty === "normal" && "보통"}
            {props.difficulty === "hard" && "어려움"}
          </Typography>
        </CardOverflow>
      </Card>
    </Box>
  );
};

export default GameCard;
