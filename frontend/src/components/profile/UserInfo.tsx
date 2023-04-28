import { ProfileDetail } from "types/Detail";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

const UserInfo = (props: ProfileDetail) => {
  return (
    <Box className="flex-container">
      <div className="profile-image">
        <img src={props.imgURL} alt="profile_image" />
      </div>
      <div>
        <div className="title">{props.nickname}</div>
        <div>
          전적 : {props.total}G {props.win}W {props.lose}L
        </div>
        <div>
          래더 점수 : {props.ELO} ({props.winRate * 100}%)
        </div>
      </div>
    </Box>
  );
};

export default UserInfo;
