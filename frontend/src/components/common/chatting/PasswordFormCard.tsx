import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChattingRoomDetail } from "types/Detail";
import ChattingService from "API/ChattingService";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import { Input } from "@mui/joy";
import { ButtonGroup, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

interface PasswordFormCardProps {
  room: ChattingRoomDetail;
  setPwIndex: Function;
  key: string;
}

const PasswordFormCard = (props: PasswordFormCardProps) => {
  const [value, setValue] = useState<string>("");
  const dispatch = useDispatch();

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setValue(target.value);
    }
  };

  const handleSubmitPassword = async () => {
    if (value.length === 0) return alert("비밀번호를 입력해주세요!");

    try {
      const response = await ChattingService.postEntrance({
        id: props.room.id,
        pwd: value,
      });

      dispatch({
        type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
        payload: {
          id: props.room.id,
          chatroomName: props.room.chatroomName,
          ownerNickname: props.room.ownerNickname,
          type: props.room.type,
          currentCount: props.room.currentCount,
          maxCount: props.room.maxCount,
        },
      });
    } catch {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <Card id="password-form" className="flex-container" variant="outlined">
      <Box className="content flex-container">
        <LockIcon />
        <Input
          className="input"
          type="password"
          placeholder="최대 20자"
          slotProps={{ input: { maxLength: 20 } }}
          onChange={handlePassword}
        />
        <ButtonGroup variant="contained">
          <Button className="submit" onClick={handleSubmitPassword}>
            확인
          </Button>
          <Button
            className="cancel"
            onClick={() => {
              props.setPwIndex(-1);
            }}
          >
            취소
          </Button>
        </ButtonGroup>
      </Box>
    </Card>
  );
};

export default PasswordFormCard;
