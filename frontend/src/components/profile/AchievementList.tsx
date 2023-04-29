import { useState } from "react";
import { Achievement } from "types/Profile";
import "styles/global.scss";
import "styles/Profile.scss";

import { Box } from "@mui/material";
import { TabPanel, Card, Typography } from "@mui/joy";

const Achievements = () => {
  const [achievementList, setAchievementList] = useState<Achievement[]>([
    {
      achvTitle: "1승 업적",
      achvContent: "1승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "42승 업적",
      achvContent: "42승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "1승 업적",
      achvContent: "1승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "42승 업적",
      achvContent: "42승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "1승 업적",
      achvContent: "1승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "42승 업적",
      achvContent: "42승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "1승 업적",
      achvContent: "1승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
    {
      achvTitle: "42승 업적",
      achvContent: "42승 업적에 관한 내용입니다.",
      achvImg: "../image.png",
    },
  ]);

  console.log(setAchievementList);

  return (
    <TabPanel value={1}>
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
    </TabPanel>
  );
};

export default Achievements;
