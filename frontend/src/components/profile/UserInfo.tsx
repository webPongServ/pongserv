import { useState } from "react";
import "styles/Profile.scss";
import "styles/global.scss";
import { ProfileDetail } from "types/Detail";

import { Box } from "@mui/material";

const UserInfo = () => {
  // 다른 사람 정보도 요청해야 하니까 여기서 요청하기
  const [userInfo, setUserInfo] = useState<ProfileDetail>({
    nickname: "susong",
    imgURL: "../image.png",
    total: 10,
    win: 9,
    lose: 1,
    ELO: 100,
    winRate: 0.9,
  });

  console.log(setUserInfo);

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
