import { useState } from "react";

import TabPanel from "@mui/joy/TabPanel";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { Link } from "react-router-dom";
import "styles/global.scss";

export type History = {
  isWin: boolean;
  myId: number;
  myNick: string;
  myImg: string;
  myScore: number;
  opId: number;
  opNick: string;
  opImg: string;
  opScore: number;
};

const GameHistoryList = () => {
  const [historyList, setHistoryList] = useState<History[]>([
    {
      isWin: true,
      myId: 0,
      myNick: "susong",
      myImg: "../image.png",
      myScore: 3,
      opId: 5,
      opNick: "noname_12",
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
  return (
    <TabPanel
      value={0}
      sx={{ p: 3, autoflow: "auto" }}
      className="flex-container profile-fullcontainer"
    >
      {historyList.map((value, index) => {
        return (
          <div className="flex-container" key={value.myId + index}>
            <Card
              variant="outlined"
              className="history-container flex-container gap"
              sx={{ flexDirection: "row" }} // why?
            >
              <Typography>{value.isWin ? "승리" : "패배"}</Typography>
              <Link to={`/profile/${value.myId}`} className="history-image">
                <img src={value.myImg} alt="history_myimage" />
                <Typography>{value.myNick}</Typography>
              </Link>
              <div>{value.myScore}</div>
              <div>vs.</div>
              <div>{value.opScore}</div>
              <Link to={`/profile/${value.opId}`} className="history-image">
                <img src={value.opImg} alt="history_opimage" />
                <Typography>{value.opNick}</Typography>
              </Link>
            </Card>
          </div>
        );
      })}
    </TabPanel>
  );
};

export default GameHistoryList;
