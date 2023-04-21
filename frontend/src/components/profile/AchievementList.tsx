import { useState } from "react";

import TabPanel from "@mui/joy/TabPanel";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import "styles/global.scss";

export type Achievement = {
  achvTitle: string;
  achvContent: string;
  achvImg: string;
};

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
  ]);
  return (
    <TabPanel
      value={1}
      sx={{ p: 3, display: "flex" }}
      className="flex-container profile-fullcontainer"
    >
      <div className="flex-wrap-container">
        {achievementList.map((value) => {
          return (
            <Card
              variant="outlined"
              className="achievement-container flex-container gap"
            >
              <div className="flex-container column">
                <img src={value.achvImg} alt="achievement_image" />
                <div>
                  <Typography>{value.achvTitle}</Typography>
                  <Typography>{value.achvContent}</Typography>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </TabPanel>
  );
};

export default Achievements;
