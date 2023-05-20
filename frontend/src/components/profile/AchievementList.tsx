import { useState, useEffect } from "react";
import { Achievement } from "types/Profile";
import EmptyListMessage from "components/utils/EmptyListMessage";
import UserService from "API/UserService";
import LoadingCircle from "components/utils/LoadingCircle";
import "styles/global.scss";
import "styles/Profile.scss";

import { Box } from "@mui/material";
import { TabPanel, Card, Typography } from "@mui/joy";

interface AchievementsProps {
  nickname: string;
}

const Achievements = (props: AchievementsProps) => {
  const achievementList: Achievement[] = [
    {
      achvTitle: "1승 업적",
      achvContent: "1승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "10승 업적",
      achvContent: "10승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "100승 업적",
      achvContent: "100승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "1패 업적",
      achvContent: "1패 업적에 관한 내용입니다.",
      achvImg: "../favicon.ico",
    },
    {
      achvTitle: "10패 업적",
      achvContent: "10패 업적에 관한 내용입니다.",
      achvImg: "../favicon.ico",
    },
    {
      achvTitle: "100패 업적",
      achvContent: "100패 업적에 관한 내용입니다.",
      achvImg: "../favicon.ico",
    },
    {
      achvTitle: "친구 1명 업적",
      achvContent: "친구 1명 업적에 관한 내용입니다.",
      achvImg: "../swords.png",
    },
    {
      achvTitle: "친구 10명 업적",
      achvContent: "친구 10명 업적에 관한 내용입니다.",
      achvImg: "../swords.png",
    },
    {
      achvTitle: "친구 100명 업적",
      achvContent: "친구 100명 업적에 관한 내용입니다.",
      achvImg: "../swords.png",
    },
  ];

  const [achieved, setAchieved] = useState<boolean[] | null>(null);

  const getAchievements = async () => {
    const response = await UserService.getAchievement(props.nickname);
    console.log(response.data);
    setAchieved(null);
  };

  useEffect(() => {
    getAchievements();
  }, [props.nickname]);

  return (
    <TabPanel value={1}>
      {achieved === null && <LoadingCircle />}
      {achieved !== null && achievementList.length === 0 && (
        <Box className="flex-container empty-achievement">
          <EmptyListMessage message="업적이 존재하지 않습니다!" />
        </Box>
      )}
      {achieved !== null && achievementList.length !== 0 && (
        <Box className="flex-wrap-container flex-container">
          {achievementList.map((value, index) => {
            return (
              <Card
                className="achievement-card flex-container"
                variant="outlined"
                key={value.achvTitle + index}
              >
                <Box className="flex-container">
                  <img src={value.achvImg} alt="achievement_img" />
                  <Box>
                    <Typography className="title">{value.achvTitle}</Typography>
                    <Typography>{value.achvContent}</Typography>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      )}
    </TabPanel>
  );
};

export default Achievements;
