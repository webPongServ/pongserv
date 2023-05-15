import { useNavigate } from "react-router-dom";
import LoadingString from "components/utils/LoadingString";
import "styles/global.scss";
import "styles/Game.scss";

import { Box, Typography } from "@mui/material";
import { Button } from "@mui/joy";

interface ComponentInfo {
  type: string;
  content: string;
  funnyImg: string;
}

const GameReady = (props: ComponentInfo) => {
  const navigate = useNavigate();

  return (
    <Box id="GameReady" className="flex-container">
      <Typography>{props.type}</Typography>
      <img src={`../${props.funnyImg}`} alt="ladder_gif" />
      <LoadingString message={props.content} />
      <Button
        onClick={() => {
          navigate("/game");
        }}
      >
        대기실로 나가기
      </Button>
    </Box>
  );
};

export default GameReady;
