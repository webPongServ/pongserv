import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AxiosResponse } from "axios";
import CustomIconButton from "components/utils/CustomIconButton";
import { MyInfoActionTypes } from "types/redux/MyInfo";
import CustomProfileButton from "components/utils/CustomProfileButton";
import { ProfileDetail } from "types/Detail";
import { IRootState } from "components/common/store";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import "styles/Game.scss";
import "styles/global.scss";

import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserService from "API/UserService";

interface EditImageModalProps {
  modalStatus: string;
  setModalStatus: Function;
  profileDetail: ProfileDetail;
  setProfileDetail: Function;
}

const EditImageModal = (props: EditImageModalProps) => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>("");
  const dispatch = useDispatch();

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

  const handlePostNewImage = async () => {
    if (!file) {
      return alert("새 프로필 사진을 등록해주세요!");
    }

    const reader: FileReader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result;
      // Send the imageData to the server for processing
      let response: AxiosResponse;
      try {
        response = await UserService.postNewImage({
          base64Data: imageData,
        });
        dispatch({
          type: MyInfoActionTypes.MYINFO_UPDATE_IMAGE,
          payload: response.data,
        });
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_MYDETAIL_IMGURL,
          payload: response.data,
        });
        props.setProfileDetail({
          ...props.profileDetail,
          imgURL: response.data,
        });
        props.setModalStatus("closed");
        setFile(null);
        setPreview(null);
      } catch (e: any) {
        if (
          e.response.data.message === "Invalid file type" ||
          e.response.data.message === "Invalid base64 data"
        )
          alert("png, jpg, jpeg, gif 파일만 가능합니다!");
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setPreview(myInfo.imgURL);
  }, [myInfo]);

  return (
    <Modal
      open={props.modalStatus === "edit-image"}
      onClose={() => {
        setPreview(myInfo.imgURL);
        props.setModalStatus("closed");
      }}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="edit" className="outframe">
          <Box className="header flex-container">
            <b>프로필 이미지 수정</b>
            <CustomIconButton
              class="red right"
              icon={<CloseIcon />}
              handleFunction={() => {
                setPreview(myInfo.imgURL);
                props.setModalStatus("closed");
              }}
            />
          </Box>
          <Box className="body flex-container">
            <Box id="new-image">
              <Box className="preview">
                <CustomProfileButton
                  class="login"
                  nickname={myInfo.nickname}
                  imgURL={preview!}
                  position="first-register"
                  handleFunction={() => {}}
                />
              </Box>
              <Box className="inform">
                프로필 사진은 10MB 이내의 png, jpg, jpeg, gif 파일만 가능합니다.
              </Box>
              <Box className="input">
                <input type="file" onChange={handleFileInputChange} />
              </Box>
              {/* <Box className="preview flex-container">
                <Box>{preview && <img src={preview} alt="Preview" />}</Box>
              </Box> */}
            </Box>
          </Box>
          <Box className="footer flex-container">
            <Button onClick={handlePostNewImage}>수정</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default EditImageModal;
