import { useState } from "react";
import CustomIconButton from "components/common/utils/CustomIconButton";
import CustomOnKeyUpInput from "components/common/utils/CustomOnKeyUpInput";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { UserDetail } from "types/Detail";
import "styles/Game.scss";
import "styles/global.scss";

import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface EditProfileModalProps {
  modalStatus: string;
  setModalStatus: Function;
}

const EditProfileModal = (props: EditProfileModalProps) => {
  const myInfo: UserDetail = useSelector((state: IRootState) => state.myInfo);
  const [newNickname, setNewNickname] = useState<string>(myInfo.nickname);
  const [isError, setIsError] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleNewNickname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target: HTMLInputElement = e.target;

    setNewNickname(target.value);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <Modal
      open={props.modalStatus === "edit-profile"}
      onClose={() => props.setModalStatus("closed")}
    >
      <ModalDialog className="modal big-modal" variant="outlined">
        <Box id="edit" className="outframe">
          <Box className="header flex-container">
            <b>정보 수정</b>
            <CustomIconButton
              class="red right"
              icon={<CloseIcon />}
              handleFunction={() => props.setModalStatus("closed")}
            />
          </Box>
          <Box className="body flex-container">
            <Box id="new-nickname">
              <Box className="flex-container">
                <Typography className="title">새 닉네임</Typography>
                <Box className="input">
                  <CustomOnKeyUpInput
                    placeholder="닉네임은 1 ~ 8자리 한글 / 영어(대, 소문자) / 숫자만 가능합니다."
                    defaultValue={myInfo.nickname}
                    maxLength={8}
                    handleFunction={handleNewNickname}
                    handleDoneTyping={() => {
                      newNickname === "susong"
                        ? setIsError(true)
                        : setIsError(false);
                    }}
                    isError={isError}
                  />
                </Box>
              </Box>
              {newNickname === "susong" ? (
                <Box className="inform fail">
                  중복된 닉네임입니다. 다시 입력해주세요.
                </Box>
              ) : (
                <Box className="inform success">사용 가능한 닉네임입니다.</Box>
              )}
            </Box>
            <Box id="new-image">
              <Box className="flex-container">
                <Typography className="title">새 프로필 이미지</Typography>
                <Box className="input">
                  <input type="file" onChange={handleFileInputChange} />
                </Box>
              </Box>
              <Box className="inform">
                프로필 사진은 200KB 이내의 png, jpg, jpeg, gif 파일만
                가능합니다.
              </Box>
              {preview && <img src={preview} alt="Preview" />}
            </Box>
          </Box>
          <Box className="footer flex-container">
            <Button
              onClick={() => {
                if (!newNickname) {
                  return alert("바꿀 닉네임을 입력해주세요!");
                } else if (isError) {
                  return alert("중복된 닉네임입니다!");
                } else if (!file) {
                  return alert("새 프로필 사진을 등록해주세요!");
                }

                const reader: FileReader = new FileReader();
                reader.onload = (e) => {
                  const imageData = e.target?.result;
                  // Send the imageData to the server for processing
                  console.group(imageData);
                };
                reader.readAsDataURL(file);
              }}
            >
              수정
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default EditProfileModal;
