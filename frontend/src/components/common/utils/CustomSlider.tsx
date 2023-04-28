import { CustomSliderProps } from "types/Utils";
import { Box, Typography } from "@mui/material";
import { Slider } from "@mui/joy";

const CustomSlider = (props: CustomSliderProps) => {
  const marks = []; // type : Mark[]

  for (let i = 2; i <= 10; i++) marks.push({ value: i, label: `${i}` });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Typography sx={{ display: "flex", alignItems: "center", width: "20%" }}>
        {props.name}
      </Typography>
      <Box style={{ width: "80%", margin: "0 auto" }}>
        <Slider
          aria-label="Small steps"
          defaultValue={props.defaultValue}
          marks={marks}
          step={1}
          min={2}
          max={10}
          valueLabelDisplay="auto"
          onChange={props.handleFunction}
        />
      </Box>
    </Box>
  );
};

export default CustomSlider;
