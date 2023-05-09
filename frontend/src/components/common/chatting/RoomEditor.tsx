import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChattingRoomForm } from "types/Form";
import CustomInput from "components/common/utils/CustomInput";
import CustomSlider from "components/common/utils/CustomSlider";
import ChattingTypeSelect from "components/common/utils/ChattingTypeSelect";
import CustomIconButton from "components/common/utils/CustomIconButton";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

interface HandleRoomDetail {
  title: string;
  type: string;
  max: number;
  setRoomStatus: Function;
}

const RoomEditor = (props: HandleRoomDetail) => {
  const [isPublic, setIsPublic] = useState<boolean>(props.type === "public");
  const [chattingRoomForm, setChattingRoomForm] = useState<ChattingRoomForm>({
    title: props.title,
    max: props.max,
    type: props.type,
    password: "",
  });
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setChattingRoomForm({ ...chattingRoomForm, title: target.value });
    }
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setChattingRoomForm({
        ...chattingRoomForm,
        max: parseInt(target.value),
      });
    }
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setChattingRoomForm({
        ...chattingRoomForm,
        type: `${target.innerText === "공개" ? "public" : "protected"}`,
      });
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target = e.target as HTMLInputElement;
      setChattingRoomForm({ ...chattingRoomForm, password: target.value });
    }
  };

  const editChattingRoom = () => {
    if (chattingRoomForm.title.length === 0)
      return alert("제목을 입력해주세요!");
    else if (
      chattingRoomForm.type === "protected" &&
      chattingRoomForm.password.length === 0
    )
      return alert("비밀번호를 입력해주세요!");
    // API call
    dispatch({
      type: CurrentChattingActionTypes.EDIT_CHATTINGROOM,
      payload: {
        title: `${chattingRoomForm.title}`,
        type: `${chattingRoomForm.type}`,
        max: `${chattingRoomForm.max}`,
      },
    });
    props.setRoomStatus("chat");
  };

  const pressESC = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" || event.key === "Esc") {
      props.setRoomStatus("chat");
    }
  };

  useEffect(() => {
    if (divRef.current) divRef.current.focus();
  }, []);

  return (
    <Box id="modal" ref={divRef} onKeyDown={pressESC} tabIndex={0}>
      <Box className="modal-header flex-container">
        <b>채팅방 정보 수정</b>
        <CustomIconButton
          class="red"
          icon={<CloseIcon />}
          handleFunction={() => {
            props.setRoomStatus("chat");
          }}
        />
      </Box>
      <Box className="modal-body flex-container">
        <CustomInput
          name="제목"
          defaultValue={props.title}
          maxLength={20}
          placeholder="최대 20자"
          handleFunction={handleTitle}
        />
        <CustomSlider
          name="최대 인원"
          defaultValue={props.max}
          min={2}
          max={10}
          handleFunction={handleMax}
        />
        <ChattingTypeSelect
          name="채팅방 유형"
          defaultValue={props.type}
          setIsPublic={setIsPublic}
          handleFunction={handleType}
        />
        {isPublic ? (
          ""
        ) : (
          <CustomInput
            name="비밀번호"
            defaultValue=""
            maxLength={20}
            placeholder="최대 20자"
            handleFunction={handlePassword}
          />
        )}
      </Box>
      <Box className="modal-footer flex-container">
        <Button onClick={editChattingRoom}>수정</Button>
      </Box>
    </Box>
  );
};

export default RoomEditor;
