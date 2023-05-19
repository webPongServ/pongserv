import { ProfileDetail } from "types/Detail";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

interface UserInfoProps {
  profileDetail: ProfileDetail;
}

const UserInfo = (props: UserInfoProps) => {
  return (
    <Box className="flex-container">
      <img src={props.profileDetail.imgURL} alt="profile_image" />
      <Box>
        <Box className="title">{props.profileDetail.nickname}</Box>
        <Box>
          전적 : {props.profileDetail.total}G {props.profileDetail.win}W{" "}
          {props.profileDetail.lose}L
        </Box>
        <Box>
          래더 점수 : {props.profileDetail.ELO} ({props.profileDetail.winRate}%)
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
