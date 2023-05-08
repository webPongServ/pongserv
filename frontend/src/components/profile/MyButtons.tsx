import { Button } from "@mui/joy";

interface MyButtonsProps {
  setModalStatus: Function;
}

const MyButtons = (props: MyButtonsProps) => {
  const handleEditNicknameButton = () => {
    props.setModalStatus("edit-nickname");
  };

  const handleTwoFactorButton = () => {
    props.setModalStatus("set-twofactor");
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
      <Button variant="solid" onClick={handleTwoFactorButton}>
        2차 인증 설정
      </Button>
    </>
  );
};

export default MyButtons;
