import { ListItemIcon, ListItemButton, ListItemText } from "@mui/material";
import { CustomProfileButtonProps } from "types/Utils";
import "styles/global.scss";

const CustomProfileButton = (props: CustomProfileButtonProps) => {
  return (
    <ListItemButton
      sx={{
        minHeight: 48,
        justifyContent: "initial",
        px: 2.5,
      }}
      onClick={props.handleFunction}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: 2,
          justifyContent: "center",
        }}
        className={props.class}
      >
        <img
          className="profile-img"
          src={`${props.imgURL}`}
          alt={`${props.position}-profile`}
        />
      </ListItemIcon>
      <ListItemText
        className={props.class}
        primary={
          props.nickname + (props.class === "inGame" ? " - 게임 중" : "")
        }
      />
    </ListItemButton>
  );
};

export default CustomProfileButton;
