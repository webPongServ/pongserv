import { useSelector } from "react-redux";
import { GameCardProps } from "types/Game";
import { IRootState } from "components/common/store";
import { GameRoomType, GameDifficultyType } from "constant";
import "styles/Game.scss";
import "styles/global.scss";

import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/system";

const GameCard = (props: GameCardProps) => {
  const gameSocket = useSelector(
    (state: IRootState) => state.sockets.gameSocket
  );

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
        gameSocket.emit(
          "enterGameRoom",
          { roomId: props.id, type: GameRoomType.normal },
          () => {
            props.setRoomStatus("normal-game");
            props.setSelectedID(props.id);
          }
        );
      }}
    >
      <Box className="flex-container">
        <Box className="preview flex-container">
          {userNickname(props.owner.nickname, props.owner.imgURL)}
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
          난이도 : {props.difficulty === GameDifficultyType.easy && "쉬움"}
          {props.difficulty === GameDifficultyType.normal && "보통"}
          {props.difficulty === GameDifficultyType.hard && "어려움"}
        </Box>
      </CardOverflow>
    </Card>
  );
};

export default GameCard;
