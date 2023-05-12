import { Link } from "react-router-dom";
import { ChatObject } from "components/common/chatting/ChattingRoom";
import "styles/ChattingDrawer.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

interface OtherMessageProps {
  otherChat: ChatObject;
  index: number;
}

const OtherMessage = (props: OtherMessageProps) => {
  return (
    <Box
      className="chatting"
      key={props.otherChat.user!.nickname + props.index}
    >
      <Link
        className="profile flex-container"
        to={`/profile/${props.otherChat.user!.nickname}`}
      >
        <img src={props.otherChat.user!.imgURL} alt="chatting-profile" />
      </Link>
      <Box className="other message">
        <Box>{props.otherChat.user!.nickname}</Box>
        <Box className="balloon">{props.otherChat.message}</Box>
      </Box>
    </Box>
  );
};

export default OtherMessage;
