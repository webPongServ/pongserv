import { useState } from "react";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box } from "@mui/material";

export type UserData = {
  nickname: string;
  imgURL: string;
  total: number;
  win: number;
  lose: number;
  ELO: number;
  winRate: number;
};

const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserData>({
    nickname: "susong",
    imgURL: "../image.png",
    total: 10,
    win: 9,
    lose: 1,
    ELO: 100,
    winRate: 0.9,
  });
  return (
    <Box className="flex-container">
      <div className="profile-image">
        <img src={userInfo.imgURL} alt="profile_image" />
      </div>
      <div>
        <div className="title">{userInfo.nickname}</div>
        <div>
          전적 : {userInfo.total}G {userInfo.win}W {userInfo.lose}L
        </div>
        <div>
          래더 점수 : {userInfo.ELO} ({userInfo.winRate * 100}%)
        </div>
      </div>
    </Box>
  );
};

export default UserInfo;
