import { ListItemIcon, ListItemButton, ListItemText } from "@mui/material";
import { CustomProfilePreviewProps } from "types/Utils";
import "styles/global.scss";

const CustomProfilePreview = (props: CustomProfilePreviewProps) => {
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
          mr: 5,
          justifyContent: "center",
        }}
        className={props.class}
      >
        <img
          className="profile-preview-img"
          src={`${props.imgURL}`}
          alt={`${props.position}-profile`}
        />
      </ListItemIcon>
      <span className={props.class}>{props.nickname}</span>
    </ListItemButton>
  );
};

export default CustomProfilePreview;
