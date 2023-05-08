import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { IRootState } from "components/common/store";
import { ProfileDetail, UserDetail } from "types/Detail";
import UserInfo from "components/profile/UserInfo";
import GameHistoryList from "components/profile/GameHistoryList";
import AchievementList from "components/profile/AchievementList";
import EditNicknameModal from "components/profile/EditNicknameModal";
import EditImageModal from "components/profile/EditImageModal";
import SetTwoFactorModal from "components/profile/SetTwoFactorModal";
import SkeletonProfile from "components/common/utils/SkeletonProfile";
import SkeletonButtons from "components/common/utils/SkeletonButtons";
import MyButtons from "components/profile/MyButtons";
import OthersButtons from "components/profile/OthersButtons";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box } from "@mui/material";
import { Tabs, TabList } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import UserService from "API/UsersService";

const Profile = () => {
  const myInfo: UserDetail = useSelector((state: IRootState) => state.myInfo);
  const friends: UserDetail[] | null = useSelector(
    (state: IRootState) => state.friends.friends
  );
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<string>("closed");
  const [profileDetail, setProfileDetail] = useState<ProfileDetail | null>(
    null
  );
  const { nickname } = useParams();

  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      const response = await UserService.getUserProfile(nickname!);
      setProfileDetail({
        nickname: response.data.nickname,
        imgURL: response.data.imgPath,
        total: response.data.total,
        win: response.data.win,
        lose: response.data.lose,
        ELO: response.data.ELO,
        winRate: response.data.winRate,
        status: "",
      });
    } catch {
      alert("유저가 존재하지 않습니다! 홈 화면으로 돌아갑니다.");
      navigate("/game");
    }
  };

  useEffect(() => {
    if (friends !== null) {
      friends.forEach((element) => {
        if (profileDetail && element.nickname === profileDetail.nickname) {
          setIsFriend(true);
        }
      });
    }
    getProfile();
    // check dependency list!!
  }, [myInfo]);

  return (
    <Box id="Profile" className="flex-container">
      <Box id="user-info-box" className="flex-container">
        <Box className="user-info flex-container">
          {profileDetail === null ? (
            <SkeletonProfile />
          ) : (
            <UserInfo
              nickname={profileDetail!.nickname}
              imgURL={profileDetail!.imgURL}
              total={profileDetail!.total}
              win={profileDetail!.win}
              lose={profileDetail!.lose}
              ELO={profileDetail!.ELO}
              winRate={profileDetail!.winRate}
              status={profileDetail!.status}
            />
          )}
        </Box>
        <Box className="button-group flex-container">
          {profileDetail === null && <SkeletonButtons />}
          {profileDetail !== null &&
            profileDetail.nickname === myInfo.nickname && (
              <MyButtons setModalStatus={setModalStatus} />
            )}
          {profileDetail !== null &&
            profileDetail!.nickname !== myInfo.nickname && (
              <OthersButtons
                isFriend={isFriend}
                setIsFriend={setIsFriend}
                profileDetail={profileDetail}
              />
            )}
        </Box>
      </Box>
      <Tabs id="history-box" aria-label="tabs" defaultValue={0}>
        <TabList
          variant="plain"
          sx={{
            width: "250px",
            "--List-padding": "0px",
            "--List-radius": "0px",
            "--ListItem-minHeight": "48px",
            [`& .${tabClasses.root}`]: {
              boxShadow: "none",
              fontWeight: "md",
              [`&.${tabClasses.selected}::before`]: {
                content: '""',
                display: "block",
                position: "absolute",
                left: "var(--ListItem-paddingLeft)", // change to `0` to stretch to the edge.
                right: "var(--ListItem-paddingRight)", // change to `0` to stretch to the edge.
                bottom: 0,
                height: 3,
                bgcolor: "primary.400",
              },
            },
          }}
        >
          <Tab>전적</Tab>
          <Tab>업적</Tab>
        </TabList>
        <Box className="history overflow">
          <GameHistoryList />
          <AchievementList />
        </Box>
      </Tabs>
      <EditNicknameModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
        profileDetail={profileDetail}
        setProfileDetail={setProfileDetail}
      />
      <EditImageModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
      />
      <SetTwoFactorModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
      />
    </Box>
  );
};

export default Profile;
