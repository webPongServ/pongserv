import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChatRoomForm } from "types/Form";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { IRootState } from "components/common/store";
import CustomInput from "components/common/utils/CustomInput";
import CustomSlider from "components/common/utils/CustomSlider";
import ChattingTypeSelect from "components/common/utils/ChattingTypeSelect";
import CustomIconButton from "components/common/utils/CustomIconButton";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

const RoomCreator = () => {
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [chatRoomForm, setChatRoomForm] = useState<ChatRoomForm>({
    title: "",
    max: 2,
    type: "public",
    password: "",
  });
  const divRef = useRef<HTMLDivElement>(null);
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const dispatch = useDispatch();

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setChatRoomForm({ ...chatRoomForm, title: target.value });
    }
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setChatRoomForm({
        ...chatRoomForm,
        max: parseInt(target.value),
      });
    }
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setChatRoomForm({
        ...chatRoomForm,
        type: `${target.innerText === "공개" ? "public" : "protected"}`,
      });
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target = e.target as HTMLInputElement;
      setChatRoomForm({ ...chatRoomForm, password: target.value });
    }
  };

  const createChattingRoom = () => {
    if (chatRoomForm.title.length === 0) return alert("제목을 입력해주세요!");
    else if (
      chatRoomForm.type === "protected" &&
      chatRoomForm.password.length === 0
    )
      return alert("비밀번호를 입력해주세요!");
    // API call
    dispatch({
      type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
      payload: {
        id: "202304280001",
        title: `${chatRoomForm.title}`,
        owner: `${myInfo.nickname}`,
        type: `${chatRoomForm.type}`,
        max: `${chatRoomForm.max}`,
        current: 1,
        createdAt: new Date(),
      },
    });
  };

  const pressESC = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      dispatch({
        type: CurrentChattingActionTypes.UPDATE_STATUS_WAITING,
        payload: "",
      });
    }
  };

  useEffect(() => {
    if (divRef.current !== null) divRef.current.focus();
  }, []);

  return (
    <Box id="modal" onKeyDown={pressESC} tabIndex={0} ref={divRef}>
      <Box className="modal-header flex-container">
        <b>채팅방 생성</b>
        <CustomIconButton
          class="red"
          icon={<CloseIcon />}
          handleFunction={() =>
            dispatch({
              type: CurrentChattingActionTypes.UPDATE_STATUS_WAITING,
              payload: "",
            })
          }
        />
      </Box>
      <Box className="modal-body flex-container">
        <CustomInput name="제목" defaultValue="" handleFunction={handleTitle} />
        <CustomSlider
          name="최대 인원"
          defaultValue={2}
          min={2}
          max={10}
          handleFunction={handleMax}
        />
        <ChattingTypeSelect
          name="채팅방 유형"
          defaultValue="public"
          setIsPublic={setIsPublic}
          handleFunction={handleType}
        />
        {isPublic ? (
          ""
        ) : (
          <CustomInput
            name="비밀번호"
            defaultValue=""
            handleFunction={handlePassword}
          />
        )}
      </Box>
      <Box className="modal-footer flex-container">
        <Button onClick={createChattingRoom}>생성</Button>
      </Box>
    </Box>
  );
};

export default RoomCreator;
