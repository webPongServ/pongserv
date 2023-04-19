import { Button } from "@mui/joy";
import "styles/Profile.scss";

type ButtonName = { name: string };

const ProfileButton = (props: ButtonName) => {
  return (
    <div className="gap">
      <Button className="medium-size">{props.name}</Button>
    </div>
  );
};

export default ProfileButton;
