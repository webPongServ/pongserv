import { ChatObject } from "components/common/chatting/ChattingRoom";
import "styles/ChattingDrawer.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

interface MyMessageProps {
  myChat: ChatObject;
  index: number;
}

const MyMessage = (props: MyMessageProps) => {
  return (
    <Box className="chatting" key={props.myChat.user!.nickname + props.index}>
      <Box className="my message">
        <Box>나</Box>
        <Box className="balloon">{props.myChat.message}</Box>
      </Box>
      <Box className="profile flex-container">
        <img src={props.myChat.user!.imgURL} alt="chatting-profile" />
      </Box>
    </Box>
  );
};

export default MyMessage;
