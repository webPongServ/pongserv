import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChatRoomForm } from "types/Form";
import { CurrentChattingActionTypes } from "types/CurrentChatting";
import { IRootState } from "components/common/store";
import "styles/global.scss";
import "styles/Chatting.scss";

import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import { Box } from "@mui/material";
import { Input } from "@mui/joy";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Slider from "@mui/joy/Slider";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const RoomCreator = () => {
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [chatRoomForm, setChatRoomForm] = useState<ChatRoomForm>({
    title: "",
    max: 2,
    type: "public",
    password: "",
  });
  const divRef = useRef<HTMLDivElement>(null);
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const dispatch = useDispatch();

  const HandleTitle: React.ChangeEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setChatRoomForm({ ...chatRoomForm, title: target.value });
    }
  };

  const CreatorInput = (type: string) => {
    let name, input;
    const marks = []; // type : Mark[]

    for (let i = 2; i <= 10; i++) marks.push({ value: i, label: `${i}` });
    switch (type) {
      case "title":
        name = "제목";
        input = (
          <Input
            placeholder="최대 20자"
            required
            slotProps={{ input: { maxLength: 20 } }}
            onChange={HandleTitle}
          />
        );
        break;

      case "max":
        name = "최대 인원";
        input = (
          <Slider
            aria-label="Small steps"
            defaultValue={2}
            marks={marks}
            step={1}
            min={2}
            max={10}
            valueLabelDisplay="auto"
            onChange={(e) => {
              if (e) {
                const target: HTMLInputElement = e.target as HTMLInputElement;
                setChatRoomForm({
                  ...chatRoomForm,
                  max: parseInt(target.value),
                });
              }
            }}
          />
        );
        break;

      case "type":
        name = "채팅방 유형";
        input = (
          <Select
            defaultValue="public"
            onChange={(e) => {
              if (e) {
                const target: HTMLInputElement = e.target as HTMLInputElement;
                setChatRoomForm({
                  ...chatRoomForm,
                  type: `${
                    target.innerText === "공개" ? "public" : "protected"
                  }`,
                });
              }
            }}
          >
            <Option value="public" onClick={() => setIsPublic(true)}>
              공개
            </Option>
            <Option value="protected" onClick={() => setIsPublic(false)}>
              비공개
            </Option>
          </Select>
        );
        break;

      case "password":
        name = "비밀번호";
        input = (
          <Input
            placeholder="최대 20자"
            type="password"
            slotProps={{ input: { maxLength: 20 } }}
            onChange={(e) => {
              if (e) {
                const target = e.target as HTMLInputElement;
                setChatRoomForm({ ...chatRoomForm, password: target.value });
              }
            }}
          />
        );
        break;

      default:
        break;
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Typography
          sx={{ display: "flex", alignItems: "center", width: "20%" }}
        >
          {name}
        </Typography>
        <Box style={{ width: "80%", margin: "0 auto" }}>{input}</Box>
      </Box>
    );
  };

  const pressESC = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      dispatch({
        type: CurrentChattingActionTypes.UPDATE_STATUS_WAITING,
        payload: "",
      });
    }
  };

  useEffect(() => {
    if (divRef.current !== null) divRef.current.focus();
  }, []);

  return (
    <Box
      sx={{ p: 5, height: "90%" }}
      onKeyDown={pressESC}
      tabIndex={0}
      ref={divRef}
    >
      <Box className="flex-container" sx={{ height: "10%" }}>
        <Typography sx={{ fontSize: "20px" }}>
          <b>채팅방 생성</b>
        </Typography>
        <IconButton
          sx={{ marginLeft: "auto" }}
          onClick={() =>
            dispatch({
              type: CurrentChattingActionTypes.UPDATE_STATUS_WAITING,
              payload: "",
            })
          }
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        className="flex-container align-normal justify-normal"
        sx={{
          flexDirection: "column",
          height: "80%",
          gap: 3,
          marginTop: "5%",
        }}
      >
        {CreatorInput("title")}
        {CreatorInput("max")}
        {CreatorInput("type")}
        {isPublic ? "" : CreatorInput("password")}
      </Box>
      <Box className="flex-container" sx={{ height: "10%" }}>
        <Button
          sx={{ width: "80%" }}
          onClick={() => {
            if (chatRoomForm.title.length === 0)
              return alert("제목을 입력해주세요!");
            else if (
              chatRoomForm.type === "protected" &&
              chatRoomForm.password.length === 0
            )
              return alert("비밀번호를 입력해주세요!");
            // API call
            dispatch({
              type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
              payload: {
                id: "202304280001",
                title: `${chatRoomForm.title}`,
                owner: `${myInfo.nickname}`,
                type: `${chatRoomForm.type}`,
                max: `${chatRoomForm.max}`,
                current: 1,
                createdAt: new Date(),
              },
            });
          }}
        >
          생성
        </Button>
      </Box>
    </Box>
  );
};

export default RoomCreator;
