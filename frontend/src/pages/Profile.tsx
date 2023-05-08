import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { FriendsActionTypes } from "types/redux/Friends";
import { IRootState } from "components/common/store";
import { ProfileDetail, UserDetail } from "types/Detail";
import UserInfo from "components/profile/UserInfo";
import GameHistoryList from "components/profile/GameHistoryList";
import AchievementList from "components/profile/AchievementList";
import EditNicknameModal from "components/profile/EditNicknameModal";
import EditImageModal from "components/profile/EditImageModal";
import SetTwoFactorModal from "components/profile/SetTwoFactorModal";
import "styles/Profile.scss";
import "styles/global.scss";

import { Box, Skeleton } from "@mui/material";
import { Button, Tabs, TabList } from "@mui/joy";
import Tab, { tabClasses } from "@mui/joy/Tab";
import UserService from "API/UsersService";

const Profile = () => {
  const myInfo: UserDetail = useSelector((state: IRootState) => state.myInfo);
  const friends: UserDetail[] | null = useSelector(
    (state: IRootState) => state.friends.friends
  );
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [modalStatus, setModalStatus] = useState<string>("closed");
  const { nickname } = useParams();
  const [profileDetail, setProfileDetail] = useState<ProfileDetail | null>(
    null
  );
  const dispatch = useDispatch();
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

  const handleDMButton = () => {
    // const data = ... // 채팅방 생성 API 요청
    dispatch({
      type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
      payload: {
        id: "202304280001", // API를 통해 받아온 데이터
        title: `[DM] ${profileDetail!.nickname}, ${myInfo.nickname}`,
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
        nickname: profileDetail!.nickname,
        imgURL: profileDetail!.imgURL,
        status: profileDetail!.status,
      },
    });
    setIsFriend(!isFriend);
  };

  const handleFriendDeleteButton = () => {
    dispatch({
      type: FriendsActionTypes.FRIENDS_DELETE,
      payload: profileDetail!.nickname,
    });
    setIsFriend(!isFriend);
  };

  const handleBlockButton = () => {};

  const handleEditNicknameButton = () => {
    setModalStatus("edit-nickname");
  };

  const handleTwoFactorButton = () => {
    setModalStatus("set-twofactor");
  };

  const handleEditImageButton = () => {
    setModalStatus("edit-image");
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
            <Box className="flex-container">
              <Skeleton className="skeleton-img" variant="circular" />
              <Box>
                <Skeleton className="skeleton-title" variant="rectangular" />
                <Skeleton className="skeleton-info" variant="rectangular" />
                <Skeleton className="skeleton-info" variant="rectangular" />
              </Box>
            </Box>
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
          {profileDetail === null && (
            <>
              <Skeleton className="skeleton-button" variant="rectangular" />
              <Skeleton className="skeleton-button" variant="rectangular" />
              <Skeleton className="skeleton-button" variant="rectangular" />
            </>
          )}
          {profileDetail !== null &&
            profileDetail.nickname === myInfo.nickname && (
              <>
                <Button variant="outlined" onClick={handleEditNicknameButton}>
                  닉네임 수정
                </Button>
                <Button variant="outlined" onClick={handleEditImageButton}>
                  프로필 이미지 수정
                </Button>
                <Button variant="solid" onClick={handleTwoFactorButton}>
                  2차 인증 설정
                </Button>
              </>
            )}
          {profileDetail !== null &&
            profileDetail!.nickname !== myInfo.nickname && (
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
