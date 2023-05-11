import { useState } from "react";
import { Link } from "react-router-dom";
import { History } from "types/Profile";
import EmptyListMessage from "components/common/utils/EmptyListMessage";
import "styles/global.scss";
import "styles/Profile.scss";

import { Box, Typography } from "@mui/material";
import { TabPanel, Card } from "@mui/joy";

const GameHistoryList = () => {
  const [historyList, setHistoryList] = useState<History[]>([
    {
      isWin: true,
      myId: 0,
      myNick: "susong",
      myImg: "../image.png",
      myScore: 3,
      opId: 5,
      opNick: "seongtki",
      opImg: "../favicon.ico",
      opScore: 1,
    },
    {
      isWin: false,
      myId: 0,
      myNick: "susong",
      myImg: "../image.png",
      myScore: 2,
      opId: 5,
      opNick: "noname_12",
      opImg: "../favicon.ico",
      opScore: 3,
    },
    {
      isWin: false,
      myId: 0,
      myNick: "susong",
      myImg: "../image.png",
      myScore: 2,
      opId: 5,
      opNick: "chanhyle",
      opImg: "../favicon.ico",
      opScore: 3,
    },
    {
      isWin: false,
      myId: 0,
      myNick: "susong",
      myImg: "../image.png",
      myScore: 2,
      opId: 5,
      opNick: "mgo",
      opImg: "../favicon.ico",
      opScore: 3,
    },
    {
      isWin: false,
      myId: 0,
      myNick: "susong",
      myImg: "../image.png",
      myScore: 2,
      opId: 5,
      opNick: "noname_12",
      opImg: "../favicon.ico",
      opScore: 3,
    },
    {
      isWin: false,
      myId: 0,
      myNick: "susong",
      myImg: "../image.png",
      myScore: 2,
      opId: 5,
      opNick: "noname_12",
      opImg: "../favicon.ico",
      opScore: 3,
    },
  ]);

  const userProfile = (nickname: string, imgURL: string): JSX.Element => {
    return (
      <Link className="user flex-container" to={`/profile/${nickname}`}>
        <Box className="flex-container direction-column">
          <img src={imgURL} alt="history_myimg" />
          <Box>{nickname}</Box>
        </Box>
      </Link>
    );
  };

  return (
    <TabPanel value={0}>
      {historyList.length === 0 ? (
        <EmptyListMessage message="전적이 존재하지 않습니다!" />
      ) : (
        historyList.map((value, index) => {
          return (
            <Box className="flex-container" key={value.myId + index}>
              <Card className="history-card flex-container" variant="outlined">
                <Box className="result">
                  <Typography className={value.isWin ? "win" : "lose"}>
                    {value.isWin ? "승리" : "패배"}
                  </Typography>
                </Box>
                {userProfile(value.myNick, value.myImg)}
                <Box className="score flex-container">
                  <Box>{value.myScore}</Box>
                  <Box>vs</Box>
                  <Box>{value.opScore}</Box>
                </Box>
                {userProfile(value.opNick, value.opImg)}
              </Card>
            </Box>
          );
        })
      )}
    </TabPanel>
  );
};

export default GameHistoryList;
