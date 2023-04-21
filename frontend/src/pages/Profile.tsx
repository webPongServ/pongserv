import UserInfo from "components/profile/UserInfo";
import ProfileButton from "components/profile/ProfileButton";
import "styles/Profile.scss";
import "styles/global.scss";

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import GameHistoryList from "components/profile/GameHistoryList";
import AchievementList from "components/profile/AchievementList";

const Profile = () => {
  return (
    <>
      <div className="flex-container profile-fullcontainer">
        <div className="profile-container flex-container">
          <UserInfo />
        </div>
        <div className="profile-container flex-container direction-column">
          <ProfileButton name="DM" />
          <ProfileButton name="친구 추가" />
          <ProfileButton name="차단" />
        </div>
      </div>
      <div className="profile-fullcontainer">
        <Tabs aria-label="tabs" defaultValue={0}>
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
          <div className="profile-fullcontainer">
            <GameHistoryList />
            <AchievementList />
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
