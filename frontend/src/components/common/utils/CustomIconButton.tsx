import { IconButton } from "@mui/material";
import { CustomIconButtonProps } from "types/Utils";

const CustomIconButton = (props: CustomIconButtonProps) => {
  return (
    <IconButton
      className={props.class}
      style={{ borderRadius: "10px" }}
      onClick={props.handleFunction}
    >
      {props.icon}
    </IconButton>
  );
};

export default CustomIconButton;
