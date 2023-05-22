import { Button } from "@mui/joy";
import AuthService from "API/AuthService";
import { ProfileDetail } from "types/Detail";

interface MyButtonsProps {
  profileDetail: ProfileDetail;
  setProfileDetail: Function;
  setModalStatus: Function;
}

const MyButtons = (props: MyButtonsProps) => {
  const handleEditNicknameButton = () => {
    props.setModalStatus("edit-nickname");
  };

  const handleActivateTwoFactorButton = () => {
    props.setModalStatus("set-twofactor");
  };

  const handleDeactivateTwoFactorButton = async () => {
    const response = await AuthService.postDeactivate2fa();
    props.setProfileDetail({ ...props.profileDetail, isTwofactor: false });
  };

  const handleEditImageButton = () => {
    props.setModalStatus("edit-image");
  };
  return (
    <>
      <Button variant="outlined" onClick={handleEditNicknameButton}>
        닉네임 수정
      </Button>
      <Button variant="outlined" onClick={handleEditImageButton}>
        프로필 이미지 수정
      </Button>
      {props.profileDetail.isTwofactor ? (
        <Button variant="outlined" onClick={handleDeactivateTwoFactorButton}>
          2차 인증 해제
        </Button>
      ) : (
        <Button variant="solid" onClick={handleActivateTwoFactorButton}>
          2차 인증 설정
        </Button>
      )}
    </>
  );
};

export default MyButtons;
