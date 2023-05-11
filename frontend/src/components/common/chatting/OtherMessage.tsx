import { Link } from "react-router-dom";
import { ChatObject } from "components/common/chatting/ChattingRoom";

import { Box } from "@mui/material";

interface OtherMessageProps {
  otherChat: ChatObject;
}

const OtherMessage = (props: OtherMessageProps) => {
  return (
    <>
      <Link
        className="profile flex-container"
        to={`/profile/${props.otherChat.user.nickname}`}
      >
        <img src={props.otherChat.user.imgURL} alt="chatting-profile" />
        <Box>{props.otherChat.user.nickname}</Box>
      </Link>
      <Box className="other message">
        <Box className="balloon">{props.otherChat.message}</Box>
      </Box>
    </>
  );
};

export default OtherMessage;
