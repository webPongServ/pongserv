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

  const handleOpenEnterModal = () => {
    gameSocket.emit(
      "enterGameRoom",
      { roomId: props.gameDetail.id, type: GameRoomType.normal },
      (response: string) => {
        if (response === "NO") return;
        props.setRoomStatus("normal-game");
        props.setSelectedRoom(props.gameDetail);
      }
    );
  };

  return (
    <Card
      className="game-card"
      variant="outlined"
      onClick={handleOpenEnterModal}
    >
      <Box className="flex-container">
        <Box className="preview flex-container">
          {userNickname(props.gameDetail.owner, props.gameDetail.ownerImage)}
          <img className="vs" src="../swords.png" alt="sword_img" />
          {userNickname("ㅤ", "../question.png")}
        </Box>
      </Box>
      <Box className="title flex-container">{props.gameDetail.title}</Box>
      <Divider />
      <CardOverflow className="card-overflow flex-container" variant="soft">
        <Box>점수 : {props.gameDetail.maxScore}</Box>
        <Box>|</Box>
        <Box>
          난이도 :{" "}
          {props.gameDetail.difficulty === GameDifficultyType.easy && "쉬움"}
          {props.gameDetail.difficulty === GameDifficultyType.normal && "보통"}
          {props.gameDetail.difficulty === GameDifficultyType.hard && "어려움"}
        </Box>
      </CardOverflow>
    </Card>
  );
};

export default GameCard;
