import { ChattingTypeSelectProps } from "types/Utils";
import { Box, Typography } from "@mui/material";
import { Select, Option } from "@mui/joy";

const ChattingTypeSelect = (props: ChattingTypeSelectProps) => {
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
        <Select
          defaultValue={props.defaultValue}
          onChange={props.handleFunction}
        >
          <Option value="공개" onClick={() => props.setIsPublic(true)}>
            공개
          </Option>
          <Option value="비공개" onClick={() => props.setIsPublic(false)}>
            비공개
          </Option>
        </Select>
      </Box>
    </Box>
  );
};

export default ChattingTypeSelect;
