import UserInfo from "components/profile/UserInfo";
import ProfileButton from "components/profile/ProfileButton";
import "styles/Profile.scss";

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Typography from "@mui/joy/Typography";

const Profile = () => {
  return (
    <>
      <div className="profile-flex">
        <div className="profile-container profile-flex">
          <UserInfo />
        </div>
        <div className="profile-container profile-flex profile-center profile-align">
          <ProfileButton name="DM" />
          <ProfileButton name="친구 추가" />
          <ProfileButton name="차단" />
        </div>
      </div>
      <div>
        <Tabs aria-label="tabs" defaultValue={0} sx={{ width: "300px" }}>
          <TabList
            variant="plain"
            sx={{
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
          <TabPanel value={0} sx={{ p: 3 }}>
            <Typography level="inherit">
              Get started with the industry-standard React UI library,
              MIT-licensed.
            </Typography>
            <Typography
              textColor="success.400"
              fontSize="xl3"
              fontWeight="xl"
              my={1}
            >
              $0{" "}
              <Typography
                fontSize="sm"
                textColor="text.secondary"
                fontWeight="md"
              >
                Free forever
              </Typography>
            </Typography>
          </TabPanel>
          <TabPanel value={1} sx={{ p: 3 }}>
            <Typography level="inherit">
              Best for professional developers building enterprise or data-rich
              applications.
            </Typography>
            <Typography
              textColor="primary.400"
              fontSize="xl3"
              fontWeight="xl"
              my={1}
            >
              $15{" "}
              <Typography
                fontSize="sm"
                textColor="text.secondary"
                fontWeight="md"
              >
                / dev / month
              </Typography>
            </Typography>
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
};

export default Profile;
