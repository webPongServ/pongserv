import { useState } from "react";

import { Box } from "@mui/material";

interface LoadingStringProps {
  message: string;
}

const LoadingString = (props: LoadingStringProps) => {
  const [timer, setTimer] = useState<number>(0);

  setTimeout(() => {
    setTimer(timer + 1);
    console.log(timer);
  }, 700);
  return <Box>{props.message + String(".").repeat((timer % 3) + 1)}</Box>;
};

export default LoadingString;
