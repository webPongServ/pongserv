import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/global.scss";

import { Box, Typography } from "@mui/material";
import { Button } from "@mui/joy";

type ComponentInfo = {
  type: string;
  content: string;
  funnyImg: string;
};

const GameWaiting = (props: ComponentInfo) => {
  const [timer, setTimer] = useState<number>(0);
  const navigate = useNavigate();

  const LoadingString = (content: string) => {
    setTimeout(() => {
      setTimer(timer + 1);
      console.log(timer);
    }, 700);
    return content + String(".").repeat((timer % 3) + 1);
  };

  return (
    <Box className="flex-container direction-column" sx={{ height: "100%" }}>
      <Typography>{props.type}</Typography>
      <img src={`../${props.funnyImg}`} alt="ladder_gif" />
      <Typography>{LoadingString(props.content)}</Typography>
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

export default GameWaiting;
