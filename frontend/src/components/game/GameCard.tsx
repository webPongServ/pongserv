import { GameCardProps } from "types/Game";
import "styles/Game.scss";
import "styles/global.scss";

import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/system";

const GameCard = (props: GameCardProps) => {
  const userNickname = (nickname: string, imgURL: string) => {
    return (
      <Box className="user flex-container">
        <img src={imgURL} alt="game_img" />
        <Typography level="body2">{nickname}</Typography>
      </Box>
    );
  };

  return (
    <Card
      className="game-card"
      variant="outlined"
      onClick={() => {
        props.setRoomStatus("normal-game");
        props.setSelectedID(props.id);
      }}
    >
      <Box className="flex-container">
        <Box className="preview flex-container">
          {userNickname(props.owner, "../image.png")}
          <img className="vs" src="../swords.png" alt="sword_img" />
          {userNickname("ㅤ", "../question.png")}
        </Box>
      </Box>
      <Box className="title flex-container">{props.title}</Box>
      <Divider />
      <CardOverflow className="card-overflow flex-container" variant="soft">
        <Box>점수 : {props.maxScore}</Box>
        <Box>|</Box>
        <Box>
          난이도 : {props.difficulty === "easy" && "쉬움"}
          {props.difficulty === "normal" && "보통"}
          {props.difficulty === "hard" && "어려움"}
        </Box>
      </CardOverflow>
    </Card>
  );
};

export default GameCard;
