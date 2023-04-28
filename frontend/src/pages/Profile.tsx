import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserInfo from "components/profile/UserInfo";
import ProfileButton from "components/profile/ProfileButton";
import { CurrentChattingTypes } from "types/CurrentChatting";
import { FriendsActionTypes } from "types/Friends";
import { IRootState } from "components/common/store";
import { ProfileDetail } from "types/Detail";
import "styles/Profile.scss";
import "styles/global.scss";

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import GameHistoryList from "components/profile/GameHistoryList";
import AchievementList from "components/profile/AchievementList";
import { Box } from "@mui/material";

const Profile = () => {
  // 다른 사람 정보도 요청해야 하니까 여기서 요청하기
  const [profileDetail, setProfileDetail] = useState<ProfileDetail>({
    nickname: "skittles",
    imgURL: "../image.png",
    total: 5,
    win: 5,
    lose: 0,
    ELO: 150,
    winRate: 0.8,
    status: "login",
  });

  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const friends = useSelector((state: IRootState) => state.friends.friends);
  const dispatch = useDispatch();
  const [isFriend, setIsFriend] = useState<boolean>(false);

  console.log(setProfileDetail);

  const handleDMButton = () => {
    // const data = ... // 채팅방 생성 API 요청
    dispatch({
      type: CurrentChattingTypes.UPDATE_STATUS_CHATTING,
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
      type: FriendsActionTypes.ADD,
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
      type: FriendsActionTypes.DELETE,
      payload: profileDetail.nickname,
    });
    setIsFriend(!isFriend);
  };

  const handleBlockButton = () => {};

  useEffect(() => {
    friends.forEach((element) => {
      if (element.nickname === profileDetail.nickname) {
        setIsFriend(true);
      }
    });
  }, []);

  return (
    <>
      <Box className="flex-container profile-fullcontainer">
        <Box className="profile-container flex-container">
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
        <Box className="profile-container flex-container direction-column">
          <ProfileButton
            type="positive"
            name="DM"
            handleOnClick={handleDMButton}
          />
          {isFriend ? (
            <ProfileButton
              name="친구 삭제"
              type="negative"
              handleOnClick={handleFriendDeleteButton}
            />
          ) : (
            <ProfileButton
              name="친구 추가"
              type="positive"
              handleOnClick={handleFriendAddButton}
            />
          )}
          <ProfileButton
            name="차단"
            type="negative"
            handleOnClick={handleBlockButton}
          />
        </Box>
      </Box>
      <Box className="profile-fullcontainer" style={{ height: "70%" }}>
        <Tabs aria-label="tabs" defaultValue={0} sx={{ height: "100%" }}>
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
          <Box className="profile-fullcontainer overflow">
            <GameHistoryList />
            <AchievementList />
          </Box>
        </Tabs>
      </Box>
    </>
  );
};

export default Profile;
