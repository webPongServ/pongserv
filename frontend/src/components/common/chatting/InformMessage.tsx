import { ChatObject } from "components/common/chatting/ChattingRoom";
import "styles/ChattingDrawer.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

interface InformMessageProps {
  informChat: ChatObject;
  index: number;
}

const InformMessage = (props: InformMessageProps) => {
  return (
    <Box
      className="inform-message"
      key={props.informChat.user!.nickname + props.index}
    >
      <Box>{props.informChat.message}</Box>
    </Box>
  );
};

export default InformMessage;
