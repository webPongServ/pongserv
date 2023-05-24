import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IRootState } from "components/common/store";
import CustomOnKeyUpInput from "components/utils/CustomOnKeyUpInput";
import { LoginStatusActionTypes } from "types/redux/Login";
import { AxiosResponse } from "axios";
import { MyInfoActionTypes } from "types/redux/MyInfo";
import UserService from "API/UserService";
import CustomProfilePreview from "components/utils/CustomProfilePreview";
import LoadingCircle from "components/utils/LoadingCircle";
import "styles/global.scss";
import "styles/Login.scss";

import CustomIconButton from "components/utils/CustomIconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";

interface FirstRegisterModalProps {
  // isMember, accessToken, OAuthData, intraId, intraImagePath
  response: any;
  setResponse: Function;
}

const checkNickname = (nickname: string): boolean => {
  const regex = /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/;

  return regex.test(nickname);
};

const FirstRegisterModal = (props: FirstRegisterModalProps) => {
  const loginStatus = useSelector((state: IRootState) => state.loginStatus);
  const [nickname, setNickname] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getNicknameDuplicate = async () => {
    const response = await UserService.getNicknameDup(nickname);
    response.data.result === true ? setIsError(true) : setIsError(false);
  };

  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const target: HTMLInputElement = e.target;
    setNickname(target.value);
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

  const handlePostNewNickname = async () => {
    if (!nickname) {
      return alert("바꿀 닉네임을 입력해주세요!");
    } else if (!checkNickname(nickname)) {
      return alert("사용할 수 없는 문자가 포함되어 있습니다.");
    } else if (isError) {
      return alert("중복된 닉네임입니다!");
    }
    const response = await UserService.postNewNickname({
      nickname: nickname,
    });
    setIsError(true);
    dispatch({
      type: MyInfoActionTypes.MYINFO_UPDATE_NICKNAME,
      payload: nickname,
    });
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

        // setFile(null);
        // setPreview(null);
      } catch (e: any) {
        if (e.response.data.message === "Invalid file type")
          alert("png, jpg, jpeg, gif 파일만 가능합니다!");
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (props.response) {
      setNickname(props.response.intraId);
      setPreview(props.response.intraImagePath);
    }
  }, []);

  useEffect(() => {
    if (props.response)
      props.setResponse({ ...props.response, intraImagePath: preview });
  }, [preview]);

  useEffect(() => {
    if (props.response)
      props.setResponse({ ...props.response, intraId: nickname });
  }, [nickname]);

  return (
    <Modal
      open={loginStatus === "first-register"}
      onClose={() => dispatch({ type: LoginStatusActionTypes.STATUS_MAIN })}
    >
      <ModalDialog className="modal big-modal" variant="outlined">
        <Box id="first-register" className="outframe">
          <Box className="header flex-container">
            <b>신규 회원 설정</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() =>
                dispatch({ type: LoginStatusActionTypes.STATUS_MAIN })
              }
            />
          </Box>
          <Box className="body">
            {props.response === null ? (
              <LoadingCircle />
            ) : (
              <>
                <Box id="preview" className="flex-container">
                  <CustomProfilePreview
                    class="big-font"
                    nickname={props.response.intraId}
                    imgURL={props.response.intraImagePath}
                    position="first-register"
                    handleFunction={() => {}}
                  />
                </Box>
                <Box id="register-form" className="flex-container">
                  <Box id="new-nickname">
                    <Box className="inform">
                      닉네임은 1 ~ 10자리 한글 / 영어(대, 소문자) / 숫자만
                      가능합니다.
                    </Box>
                    <Box className="input">
                      <CustomOnKeyUpInput
                        placeholder="새 닉네임을 입력하세요."
                        defaultValue={props.response.intraId}
                        maxLength={10}
                        handleFunction={handleNickname}
                        handleDoneTyping={getNicknameDuplicate}
                        isError={isError}
                      />
                    </Box>
                    {(nickname === "" || isError) && (
                      <Box className="inform fail">
                        {nickname === ""
                          ? " "
                          : "중복된 닉네임입니다. 다시 입력해주세요."}
                      </Box>
                    )}
                    {!(nickname === "" || isError) && (
                      <Box className="inform success">
                        사용 가능한 닉네임입니다.
                      </Box>
                    )}
                    <Button onClick={handlePostNewNickname}>닉네임 수정</Button>
                  </Box>
                  <Box id="new-image">
                    <Box className="inform">
                      프로필 사진은 10MB 이내의 png, jpg, jpeg, gif 파일만
                      가능합니다.
                    </Box>
                    <Box className="input">
                      <input type="file" onChange={handleFileInputChange} />
                    </Box>
                    <Box className="preview flex-container"></Box>
                    <Button onClick={handlePostNewImage}>
                      프로필 이미지 수정
                    </Button>
                  </Box>
                </Box>
                <Box>수정 버튼을 눌러야 변경 사항이 적용됩니다.</Box>
              </>
            )}
          </Box>
          <Box className="footer flex-container">
            <Button
              onClick={() => {
                navigate("/game");
              }}
            >
              확인
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default FirstRegisterModal;
