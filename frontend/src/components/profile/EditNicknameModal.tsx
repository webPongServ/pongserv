import { useEffect, useState } from "react";
import CustomIconButton from "components/utils/CustomIconButton";
import CustomOnKeyUpInput from "components/utils/CustomOnKeyUpInput";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IRootState } from "components/common/store";
import { UserDetail } from "types/Detail";
import CustomProfileButton from "components/utils/CustomProfileButton";
import "styles/Game.scss";
import "styles/global.scss";

import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserService from "API/UserService";

interface EditNicknameModalProps {
  modalStatus: string;
  setModalStatus: Function;
  setIsNew: Function;
}

const EditNicknameModal = (props: EditNicknameModalProps) => {
  const myInfo: UserDetail = useSelector((state: IRootState) => state.myInfo);
  const [newNickname, setNewNickname] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(true);
  const navigate = useNavigate();

  const getNicknameDuplicate = async () => {
    const response = await UserService.getNicknameDup(newNickname);
    response.data.result === true ? setIsError(true) : setIsError(false);
  };

  const handleNewNickname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target: HTMLInputElement = e.target;
    setNewNickname(target.value);
  };

  const handlePostNewNickname = async () => {
    if (!newNickname) {
      return alert("바꿀 닉네임을 입력해주세요!");
    } else if (isError) {
      return alert("중복된 닉네임입니다!");
    }
    const response = await UserService.postNewNickname({
      nickname: newNickname,
    });

    props.setModalStatus("closed");
    props.setIsNew(true);
    setIsError(true);
    navigate(`/profile/${response.data.new}`);
  };

  useEffect(() => {
    setNewNickname(myInfo.nickname);
  }, [myInfo]);

  return (
    <Modal
      open={props.modalStatus === "edit-nickname"}
      onClose={() => {
        props.setModalStatus("closed");
        setNewNickname(myInfo.nickname);
        setIsError(true);
      }}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="edit" className="outframe">
          <Box className="header flex-container">
            <b>닉네임 수정</b>
            <CustomIconButton
              class="red right"
              icon={<CloseIcon />}
              handleFunction={() => {
                props.setModalStatus("closed");
                setNewNickname(myInfo.nickname);
                setIsError(true);
              }}
            />
          </Box>
          <Box className="body flex-container">
            <Box id="new-nickname">
              <Box className="preview">
                <CustomProfileButton
                  class="login"
                  nickname={newNickname}
                  imgURL={myInfo.imgURL}
                  position="first-register"
                  handleFunction={() => {}}
                />
              </Box>
              <Box className="inform">
                닉네임은 1 ~ 10자리 한글 / 영어(대, 소문자) / 숫자만 가능합니다.
              </Box>
              <Box className="input">
                <CustomOnKeyUpInput
                  placeholder="새 닉네임을 입력하세요."
                  defaultValue={myInfo.nickname}
                  maxLength={10}
                  handleFunction={handleNewNickname}
                  handleDoneTyping={getNicknameDuplicate}
                  isError={isError}
                />
              </Box>
              {newNickname === "" && null}
              {isError && (
                <Box className="inform fail">
                  중복된 닉네임입니다. 다시 입력해주세요.
                </Box>
              )}
              {!(newNickname === "" || isError) && (
                <Box className="inform success">사용 가능한 닉네임입니다.</Box>
              )}
            </Box>
          </Box>
          <Box className="footer flex-container">
            <Button onClick={handlePostNewNickname}>수정</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default EditNicknameModal;
