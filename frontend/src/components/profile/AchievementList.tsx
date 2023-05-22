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
  const [achievementList, setAchievementList] = useState<Map<
    string,
    Achievement
  > | null>(null);

  const getAchievements = async () => {
    const response = await UserService.getAchievement(props.nickname);
    const newList = new Map([
      [
        "WIN1",
        {
          achvTitle: "1승 업적",
          achvContent: "1승 업적에 관한 내용입니다.",
          achvImg: "../image.png",
          isAchvd: false,
        },
      ],
      [
        "WIN10",
        {
          achvTitle: "10승 업적",
          achvContent: "10승 업적에 관한 내용입니다.",
          achvImg: "../image.png",
          isAchvd: false,
        },
      ],
      [
        "WIN100",
        {
          achvTitle: "100승 업적",
          achvContent: "100승 업적에 관한 내용입니다.",
          achvImg: "../image.png",
          isAchvd: false,
        },
      ],
      [
        "WIN1000",
        {
          achvTitle: "1000승 업적",
          achvContent: "1000승 업적에 관한 내용입니다.",
          achvImg: "../image.png",
          isAchvd: false,
        },
      ],
      [
        "LOSS1",
        {
          achvTitle: "1패 업적",
          achvContent: "1패 업적에 관한 내용입니다.",
          achvImg: "../image.png",
          isAchvd: false,
        },
      ],
      [
        "LOSS10",
        {
          achvTitle: "10패 업적",
          achvContent: "10패 업적에 관한 내용입니다.",
          achvImg: "../favicon.ico",
          isAchvd: false,
        },
      ],
      [
        "LOSS100",
        {
          achvTitle: "100패 업적",
          achvContent: "100패 업적에 관한 내용입니다.",
          achvImg: "../favicon.ico",
          isAchvd: false,
        },
      ],
      [
        "LOSS1000",
        {
          achvTitle: "1000패 업적",
          achvContent: "1000패 업적에 관한 내용입니다.",
          achvImg: "../favicon.ico",
          isAchvd: false,
        },
      ],
      [
        "FRIEND1",
        {
          achvTitle: "친구 1명 업적",
          achvContent: "친구 1명 업적에 관한 내용입니다.",
          achvImg: "../swords.png",
          isAchvd: false,
        },
      ],
      [
        "FRIEND10",
        {
          achvTitle: "친구 10명 업적",
          achvContent: "친구 10명 업적에 관한 내용입니다.",
          achvImg: "../swords.png",
          isAchvd: false,
        },
      ],
      [
        "FRIEND100",
        {
          achvTitle: "친구 100명 업적",
          achvContent: "친구 100명 업적에 관한 내용입니다.",
          achvImg: "../swords.png",
          isAchvd: false,
        },
      ],
      [
        "FRIEND1000",
        {
          achvTitle: "친구 1000명 업적",
          achvContent: "친구 1000명 업적에 관한 내용입니다.",
          achvImg: "../swords.png",
          isAchvd: false,
        },
      ],
    ]);

    for (let i = 0; i < response.data.length; i++) {
      if (newList.get(response.data[i]) !== undefined) {
        newList.get(response.data[i])!.isAchvd = true;
      }
    }
    setAchievementList(newList);
  };

  useEffect(() => {
    getAchievements();
  }, [props.nickname]);

  return (
    <TabPanel value={1}>
      {achievementList === null && <LoadingCircle />}
      {achievementList !== null && (
        <Box className="flex-wrap-container flex-container">
          {Array.from(achievementList!).map(([key, value], index) => {
            return (
              <Card
                className="achievement-card flex-container"
                variant="outlined"
                key={value.achvTitle + index}
              >
                <Box className="flex-container">
                  <img
                    className={value.isAchvd ? "" : "not-achieved"}
                    src={value.achvImg}
                    alt="achievement_img"
                  />
                  <Box>
                    <Typography
                      className={`title ${value.isAchvd ? "" : "not-achieved"}`}
                    >
                      {value.achvTitle}
                    </Typography>
                    <Typography className={value.isAchvd ? "" : "not-achieved"}>
                      {value.achvContent}
                    </Typography>
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
