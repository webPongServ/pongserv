import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileDetail } from "types/Detail";
import UserInfo from "components/profile/UserInfo";
import GameHistoryList from "components/profile/GameHistoryList";
import AchievementList from "components/profile/AchievementList";
import EditNicknameModal from "components/profile/EditNicknameModal";
import EditImageModal from "components/profile/EditImageModal";
import SetTwoFactorModal from "components/profile/SetTwoFactorModal";
import SkeletonProfile from "components/utils/SkeletonProfile";
import SkeletonButtons from "components/utils/SkeletonButtons";
import MyButtons from "components/profile/MyButtons";
import OthersButtons from "components/profile/OthersButtons";
import { MyInfoActionTypes } from "types/redux/MyInfo";
import { ProfileStatusType } from "constant";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box } from "@mui/material";
import { Tabs, TabList } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import UserService from "API/UserService";

const Profile = () => {
  const [isNew, setIsNew] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<string>("closed");
  const [profileDetail, setProfileDetail] = useState<ProfileDetail | null>(
    null
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nickname } = useParams();

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
        status: response.data.status,
      });
      if (isNew)
        dispatch({
          type: MyInfoActionTypes.MYINFO_UPDATE_NICKNAME,
          payload: nickname,
        });
      setIsNew(false);
    } catch {
      window.location.href = "/game?error=invalid_user";
    }
  };

  useEffect(() => {
    getProfile();
    // check dependency list!!
  }, [nickname]);

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
            profileDetail.status === ProfileStatusType.self && (
              <MyButtons setModalStatus={setModalStatus} />
            )}
          {profileDetail !== null &&
            profileDetail!.status !== ProfileStatusType.self && (
              <OthersButtons
                profileDetail={profileDetail}
                setProfileDetail={setProfileDetail}
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
        setIsNew={setIsNew}
      />
      <EditImageModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
        profileDetail={profileDetail!}
        setProfileDetail={setProfileDetail}
      />
      <SetTwoFactorModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
      />
    </Box>
  );
};

export default Profile;
