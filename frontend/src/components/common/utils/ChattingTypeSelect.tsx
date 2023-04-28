import { CustomSelectProps } from "types/Utils";
import { Box, Typography } from "@mui/material";
import { Select, Option } from "@mui/joy";

const CustomSelect = (props: CustomSelectProps) => {
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
          <Option value="public" onClick={() => props.setIsPublic(true)}>
            공개
          </Option>
          <Option value="protected" onClick={() => props.setIsPublic(false)}>
            비공개
          </Option>
        </Select>
      </Box>
    </Box>
  );
};

export default CustomSelect;
