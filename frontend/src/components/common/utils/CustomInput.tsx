import { CustomInputProps } from "types/Utils";
import { Box, Typography } from "@mui/material";
import { Input } from "@mui/joy";

const CustomInput = (props: CustomInputProps) => {
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
        <Input
          placeholder="최대 20자"
          defaultValue={props.defaultValue}
          type={props.name === "비밀번호" ? "password" : "text"}
          required
          slotProps={{ input: { maxLength: 20 } }}
          onChange={props.handleFunction}
        />
      </Box>
    </Box>
  );
};

export default CustomInput;
