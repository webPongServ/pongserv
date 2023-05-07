import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { FriendsActionTypes } from "types/redux/Friends";
import { IRootState } from "components/common/store";
import { ProfileDetail, UserDetail } from "types/Detail";
import UserInfo from "components/profile/UserInfo";
import GameHistoryList from "components/profile/GameHistoryList";
import AchievementList from "components/profile/AchievementList";
import EditProfileModal from "components/profile/EditProfileModal";
import SetTwoFactorModal from "components/profile/SetTwoFactorModal";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box } from "@mui/material";
import { Button, Tabs, TabList } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import UserService from "API/UsersService";

const Profile = () => {
  const myInfo: UserDetail = useSelector((state: IRootState) => state.myInfo);
  const friends: UserDetail[] = useSelector(
    (state: IRootState) => state.friends.friends
  );
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<string>("closed");
  const dispatch = useDispatch();
  const { nickname } = useParams();

  const getProfile = async () => {
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
  };

  // loading 창 띄우기
  const [profileDetail, setProfileDetail] = useState<ProfileDetail>({
    nickname: "susong",
    imgURL: "../image.png",
    total: 5,
    win: 5,
    lose: 0,
    ELO: 150,
    winRate: 0.8,
    status: "login",
  });

  const handleDMButton = () => {
    // const data = ... // 채팅방 생성 API 요청
    dispatch({
      type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
      payload: {
        id: "202304280001", // API를 통해 받아온 데이터
        title: `[DM] ${profileDetail.nickname}, ${myInfo.nickname}`,
        owner: `${myInfo.nickname}`,
        type: "private",
        max: 2,
        current: 1,
        createdAt: new Date(),
      },
    });
  };

  const handleFriendAddButton = () => {
    dispatch({
      type: FriendsActionTypes.FRIENDS_ADD,
      payload: {
        nickname: profileDetail.nickname,
        imgURL: profileDetail.imgURL,
        status: profileDetail.status,
      },
    });
    setIsFriend(!isFriend);
  };

  const handleFriendDeleteButton = () => {
    dispatch({
      type: FriendsActionTypes.FRIENDS_DELETE,
      payload: profileDetail.nickname,
    });
    setIsFriend(!isFriend);
  };

  const handleBlockButton = () => {};

  const handleEditButton = () => {
    setModalStatus("edit-profile");
  };

  const handleTwoFactorButton = () => {
    setModalStatus("set-twofactor");
  };

  useEffect(() => {
    friends.forEach((element) => {
      if (element.nickname === profileDetail.nickname) {
        setIsFriend(true);
      }
    });
    getProfile();

    // check dependency list!!
  }, []);

  return (
    <Box id="Profile" className="flex-container">
      <Box id="user-info-box" className="flex-container">
        <Box className="user-info flex-container">
          <UserInfo
            nickname={profileDetail.nickname}
            imgURL={profileDetail.imgURL}
            total={profileDetail.total}
            win={profileDetail.win}
            lose={profileDetail.lose}
            ELO={profileDetail.ELO}
            winRate={profileDetail.winRate}
            status={profileDetail.status}
          />
        </Box>
        <Box className="button-group flex-container">
          {profileDetail.nickname === myInfo.nickname ? (
            <>
              <Button variant="outlined" onClick={handleEditButton}>
                정보 수정
              </Button>
              <Button variant="solid" onClick={handleTwoFactorButton}>
                2차 인증 설정
              </Button>
            </>
          ) : (
            <>
              <Button variant="solid" onClick={handleDMButton}>
                DM
              </Button>
              <Button
                variant={isFriend ? "outlined" : "solid"}
                onClick={
                  isFriend ? handleFriendDeleteButton : handleFriendAddButton
                }
              >
                {isFriend ? "친구 삭제" : "친구 추가"}
              </Button>
              <Button variant="outlined" onClick={handleBlockButton}>
                차단
              </Button>
            </>
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
      <EditProfileModal
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
