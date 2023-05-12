import { ChatObject } from "components/common/chatting/ChattingRoom";
import "styles/ChattingDrawer.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

interface MyMessageProps {
  myChat: ChatObject;
}

const MyMessage = (props: MyMessageProps) => {
  return (
    <Box className="chatting">
      <Box className="my message">
        <Box className="balloon">{props.myChat.message}</Box>
      </Box>
      <Box className="profile flex-container">
        <img src={props.myChat.user!.imgURL} alt="chatting-profile" />
        <Box>나</Box>
      </Box>
    </Box>
  );
};

export default MyMessage;
