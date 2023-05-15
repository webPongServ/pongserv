import { GameDifficultyRadioGroupProps } from "types/Utils";
import { Box, Typography } from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { GameDifficultyType } from "constant";

const GameDifficultyRadioGroup = (props: GameDifficultyRadioGroupProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Typography sx={{ display: "flex", alignItems: "center", width: "20%" }}>
        {props.name}
        <Tooltip
          title={
            <Typography>난이도가 어려울수록 막대가 짧아집니다.</Typography>
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
      </Typography>
      <Box style={{ width: "80%", margin: "0 auto" }}>
        <FormControl
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Box className="flex-container"></Box>
          <RadioGroup
            row
            defaultValue={props.defaultValue}
            onChange={props.handleFunction}
          >
            <FormControlLabel
              value={GameDifficultyType.easy}
              control={<Radio />}
              label="쉬움"
            />
            <FormControlLabel
              value={GameDifficultyType.normal}
              control={<Radio />}
              label="보통"
            />
            <FormControlLabel
              value={GameDifficultyType.hard}
              control={<Radio />}
              label="어려움"
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default GameDifficultyRadioGroup;
