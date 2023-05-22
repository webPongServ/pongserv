import { useState, useEffect } from "react";
import { Achievement } from "types/Profile";
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
          achvTitle: "퍼스트 블러드!",
          achvContent: "일반 / 래더 게임 1승 달성",
          achvImg: "../award.png",
          isAchvd: false,
        },
      ],
      [
        "WIN10",
        {
          achvTitle: "게임에 소질이 있으시군요?",
          achvContent: "일반 / 래더 게임 10승 달성",
          achvImg: "../award.png",
          isAchvd: false,
        },
      ],
      [
        "WIN100",
        {
          achvTitle: "백전백승",
          achvContent: "일반 / 래더 게임 100승 달성",
          achvImg: "../award.png",
          isAchvd: false,
        },
      ],
      [
        "WIN1000",
        {
          achvTitle: "역사상 최고, GOAT",
          achvContent: "일반 / 래더 게임 1000승 달성",
          achvImg: "../award.png",
          isAchvd: false,
        },
      ],
      [
        "LOSS1",
        {
          achvTitle: "설마 두번 지나요?",
          achvContent: "일반 / 래더 게임 1패",
          achvImg: "../game-over.png",
          isAchvd: false,
        },
      ],
      [
        "LOSS10",
        {
          achvTitle: "와 10패 쉽지않은데..",
          achvContent: "일반 / 래더 게임 10패",
          achvImg: "../game-over.png",
          isAchvd: false,
        },
      ],
      [
        "LOSS100",
        {
          achvTitle: "이게 가능한거였나요?",
          achvContent: "일반 / 래더 게임 100패",
          achvImg: "../game-over.png",
          isAchvd: false,
        },
      ],
      [
        "LOSS1000",
        {
          achvTitle: "롤하면 아이언일듯;",
          achvContent: "일반 / 래더 게임 1000패",
          achvImg: "../game-over.png",
          isAchvd: false,
        },
      ],
      [
        "FRIEND1",
        {
          achvTitle: "친구가 있다니 대단해요",
          achvContent: "친구 목록 1명 달성",
          achvImg: "../friendship.png",
          isAchvd: false,
        },
      ],
      [
        "FRIEND10",
        {
          achvTitle: "인싸 기만자 OUT!",
          achvContent: "친구 목록 10명 달성",
          achvImg: "../friendship.png",
          isAchvd: false,
        },
      ],
      [
        "FRIEND100",
        {
          achvTitle: "그대는 코알리숑 마스터?",
          achvContent: "친구 목록 100명 달성",
          achvImg: "../friendship.png",
          isAchvd: false,
        },
      ],
      [
        "FRIEND1000",
        {
          achvTitle: "친구 이름 기억 가능?",
          achvContent: "친구 목록 1000명 달성",
          achvImg: "../friendship.png",
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
                <Box className="achievement-container">
                  <img
                    className={value.isAchvd ? "" : "not-achieved"}
                    src={value.achvImg}
                    alt="achievement_img"
                  />
                  <Box className="flex-container direction-column">
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
