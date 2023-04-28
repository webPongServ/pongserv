import { Button } from "@mui/joy";
import "styles/Profile.scss";

interface ProfileButtonProps {
  name: string;
  type: string;
  handleOnClick: React.MouseEventHandler<HTMLAnchorElement>;
}

const ProfileButton = (props: ProfileButtonProps) => {
  return (
    <div className="gap">
      <Button
        variant={props.type === "positive" ? "solid" : "outlined"}
        onClick={props.handleOnClick}
        className="medium-size"
      >
        {props.name}
      </Button>
    </div>
  );
};

export default ProfileButton;
