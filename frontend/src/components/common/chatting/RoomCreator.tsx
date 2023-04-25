import { useState } from "react";

import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import { Box } from "@mui/material";
import { Input } from "@mui/joy";
import "styles/global.scss";
import "styles/Chatting.scss";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Slider from "@mui/joy/Slider";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type HandleRoomID = { roomID: string; setRoomID: Function };

const RoomCreator = (props: HandleRoomID) => {
  const [isPublic, setIsPublic] = useState<boolean>(true);

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
            // props={{ maxLength: 20 }}
            // onChange={(e) => {
            //   if (e) {
            //     const target = e.target as HTMLInputElement;
            //     setPartyForm({ ...partyForm, title: target.value });
            //   }
            // }}
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
            // onChange={(e) => {
            //   if (e) {
            //     const target: HTMLInputElement = e.target as HTMLInputElement;
            //     props.setPartyForm({
            //       ...props.partyForm,
            //       max: target.value,
            //     });
            //   }
            // }}
          />
        );
        break;

      case "type":
        name = "채팅방 유형";
        input = (
          <Select
            defaultValue="public"
            // onChange={(e) => {
            //   if (e) {
            //     const target: HTMLInputElement = e.target as HTMLInputElement;
            //     props.setPartyForm({
            //       ...props.partyForm,
            //       category: target.outerText,
            //     });
            //   }
            // }}
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
            // onChange={(e) => {
            //   if (e) {
            //     const target = e.target as HTMLInputElement;
            //     setPartyForm({ ...partyForm, title: target.value });
            //   }
            // }}
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

  return (
    <Box sx={{ p: 5, height: "90%" }}>
      <Box className="flex-container" sx={{ height: "10%" }}>
        <Typography sx={{ fontSize: "20px" }}>
          <b>채팅방 생성</b>
        </Typography>
        <IconButton
          sx={{ marginLeft: "auto" }}
          onClick={() => props.setRoomID("waiting")}
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
        <Button sx={{ width: "80%" }}>생성</Button>
      </Box>
    </Box>
  );
};

export default RoomCreator;
