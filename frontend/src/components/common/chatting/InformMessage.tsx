import { ChatObject } from "components/common/chatting/ChattingRoom";
import "styles/ChattingDrawer.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

interface InformMessageProps {
  informChat: ChatObject;
}

const InformMessage = (props: InformMessageProps) => {
  return (
    <Box className="inform-message">
      <Box>{props.informChat.message}</Box>
    </Box>
  );
};

export default InformMessage;
