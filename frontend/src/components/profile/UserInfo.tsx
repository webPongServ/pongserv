import { ProfileDetail } from "types/Detail";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

const UserInfo = (props: ProfileDetail) => {
  return (
    <Box className="flex-container">
      <img src={props.imgURL} alt="profile_image" />
      <Box>
        <Box className="title">{props.nickname}</Box>
        <Box>
          전적 : {props.total}G {props.win}W {props.lose}L
        </Box>
        <Box>
          래더 점수 : {props.ELO} ({props.winRate}%)
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
