import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "styles/global.scss";
import "styles/Game.scss";

import { Typography } from "@mui/material";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import { Input } from "@mui/joy";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Slider from "@mui/joy/Slider";
import IconButton from "@mui/joy/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

type CreateGameModalProps = {
  roomStatus: string;
  setRoomStatus: Function;
};

const CreateGameModal = (props: CreateGameModalProps) => {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState<string>("203404250001");

  console.log(setRoomID);

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

      case "maxScore":
        name = "점수";
        input = (
          <Slider
            aria-label="Small steps"
            defaultValue={5}
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

      case "difficulty":
        name = "난이도";
        input = (
          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Box className="flex-container"></Box>
            <RadioGroup row defaultValue="easy">
              <FormControlLabel value="easy" control={<Radio />} label="쉬움" />
              <FormControlLabel
                value="normal"
                control={<Radio />}
                label="보통"
              />
              <FormControlLabel
                value="hard"
                control={<Radio />}
                label="어려움"
              />
            </RadioGroup>
          </FormControl>
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
          {name === "난이도" ? (
            <Tooltip
              title={
                <Typography sx={{ fontSize: "15px" }}>
                  난이도가 어려워질수록 막대 길이가 짧아집니다.
                </Typography>
              }
              placement="bottom-start"
              followCursor
            >
              <HelpOutlineIcon
                sx={{
                  width: "20px",
                  height: "20px",
                  marginLeft: "5px",
                  "&:hover": { color: "skyblue" },
                }}
              />
            </Tooltip>
          ) : null}
        </Typography>
        <Box style={{ width: "80%", margin: "0 auto" }}>{input}</Box>
      </Box>
    );
  };

  return (
    <Modal
      open={props.roomStatus === "create-game"}
      onClose={() => props.setRoomStatus("game")}
    >
      <ModalDialog className="game-modal-big" variant="outlined">
        <Box sx={{ p: 3, height: "100%" }}>
          <Box className="flex-container" sx={{ height: "10%" }}>
            <Typography sx={{ fontSize: "20px" }}>
              <b>일반 게임 생성</b>
            </Typography>
            <IconButton
              sx={{ marginLeft: "auto" }}
              onClick={() => props.setRoomStatus("game")}
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
              paddingTop: "5%",
            }}
          >
            {CreatorInput("title")}
            {CreatorInput("maxScore")}
            {CreatorInput("difficulty")}
          </Box>
          <Box className="flex-container" sx={{ height: "10%" }}>
            <Button sx={{ width: "80%" }}>생성</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default CreateGameModal;
