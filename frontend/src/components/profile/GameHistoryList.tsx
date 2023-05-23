import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyListMessage from "components/utils/EmptyListMessage";
import { useSelector } from "react-redux";
import { History } from "types/Profile";
import UserService from "API/UserService";
import LoadingCircle from "components/utils/LoadingCircle";
import { GameRoomType, GameResultType } from "constant";
import { IRootState } from "components/common/store";
import "styles/global.scss";
import "styles/Profile.scss";

import { Box, Typography } from "@mui/material";
import { TabPanel, Card } from "@mui/joy";

interface GameHistoryListProps {
  nickname: string;
}

interface serverHistoryList {
  getScr: number;
  gmRsltCd: string;
  gmType: string;
  lossScr: number;
  opImgPath: string;
  opNickname: string;
  opUserId: string;
  userImgPath: string;
  userNickname: string;
}

const GameHistoryList = (props: GameHistoryListProps) => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const [historyList, setHistoryList] = useState<History[] | null>(null);

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

  const getGameHistory = async () => {
    const response = await UserService.getGameHistory(props.nickname);
    setHistoryList(
      response.data.map(
        (value: serverHistoryList): History => ({
          isWin: value.gmRsltCd === GameResultType.win,
          isDodge:
            (value.gmRsltCd === GameResultType.win &&
              value.getScr <= value.lossScr) ||
            (value.gmRsltCd === GameResultType.lose &&
              value.getScr >= value.lossScr),
          myNick: value.userNickname,
          myImg: value.userImgPath,
          myScore: value.getScr,
          opNick: value.opNickname,
          opImg: value.opImgPath,
          opScore: value.lossScr,
          type: value.gmType,
        })
      )
    );
  };

  useEffect(() => {
    getGameHistory();
  }, [props.nickname, myInfo]);

  return (
    <TabPanel value={0}>
      {historyList === null && <LoadingCircle />}
      {historyList !== null && historyList.length === 0 && (
        <EmptyListMessage message="전적이 존재하지 않습니다!" />
      )}
      {historyList !== null &&
        historyList.length !== 0 &&
        historyList!.map((value, index) => {
          return (
            <Box
              className="flex-container"
              key={value.myNick + value.opNick + index}
            >
              <Card className="history-card flex-container" variant="outlined">
                <Box className="result">
                  <Typography>
                    {value.type === GameRoomType.normal ? "일반" : "래더"}
                  </Typography>
                  <Typography className={value.isWin ? "win" : "lose"}>
                    {value.isWin ? "승리" : "패배"}
                    {value.isDodge ? "(몰수)" : null}
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
        })}
    </TabPanel>
  );
};

export default GameHistoryList;
