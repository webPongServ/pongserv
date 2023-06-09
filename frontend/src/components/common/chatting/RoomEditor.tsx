import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { ChattingRoomForm } from "types/Form";
import CustomInput from "components/utils/CustomInput";
import CustomSlider from "components/utils/CustomSlider";
import ChattingTypeSelect from "components/utils/ChattingTypeSelect";
import CustomIconButton from "components/utils/CustomIconButton";
import ChattingService from "API/ChattingService";
import { useSelector } from "react-redux";
import { IRootState } from "components/common/store";
import { ChattingRoomType } from "constant";
import { ChattingRoomDetail } from "types/Detail";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

interface HandleRoomDetail {
  chatroomName: string;
  type: string;
  maxCount: number;
  setRoomStatus: Function;
}

const RoomEditor = (props: HandleRoomDetail) => {
  const currentChattingRoomDetail: ChattingRoomDetail = useSelector(
    (state: IRootState) => state.currentChatting.chattingRoomDetail!
  );
  const [isPublic, setIsPublic] = useState<boolean>(
    props.type === ChattingRoomType.public
  );
  const [chattingRoomForm, setChattingRoomForm] = useState<ChattingRoomForm>({
    chatroomName: props.chatroomName,
    maxCount: props.maxCount,
    type: props.type,
    password: "",
  });
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target;
      setChattingRoomForm({ ...chattingRoomForm, chatroomName: target.value });
    }
  };

  const handleMax = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setChattingRoomForm({
        ...chattingRoomForm,
        maxCount: parseInt(target.value, 10),
      });
    }
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target: HTMLInputElement = e.target as HTMLInputElement;
      setChattingRoomForm({
        ...chattingRoomForm,
        type: `${
          target.innerText === "공개"
            ? ChattingRoomType.public
            : ChattingRoomType.protected
        }`,
      });
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const target = e.target as HTMLInputElement;
      setChattingRoomForm({ ...chattingRoomForm, password: target.value });
    }
  };

  const editChattingRoom = async () => {
    if (chattingRoomForm.chatroomName.length === 0)
      return alert("제목을 입력해주세요!");
    else if (
      chattingRoomForm.type === "protected" &&
      chattingRoomForm.password.length === 0
    )
      return alert("비밀번호를 입력해주세요!");
    const response = await ChattingService.patchChattingRoom({
      id: currentChattingRoomDetail.id,
      name: chattingRoomForm.chatroomName,
      type: chattingRoomForm.type,
      max: chattingRoomForm.maxCount,
      pwd: chattingRoomForm.password,
    });
    dispatch({
      type: CurrentChattingActionTypes.EDIT_CHATTINGROOM,
      payload: {
        chatroomName: `${chattingRoomForm.chatroomName}`,
        type: `${chattingRoomForm.type}`,
        maxCount: `${chattingRoomForm.maxCount}`,
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
          defaultValue={props.chatroomName}
          maxLength={20}
          placeholder="최대 20자"
          handleFunction={handleTitle}
        />
        <CustomSlider
          name="최대 인원"
          defaultValue={props.maxCount}
          min={2}
          max={10}
          handleFunction={handleMax}
        />
        <ChattingTypeSelect
          name="채팅방 유형"
          defaultValue={isPublic ? "공개" : "비공개"}
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
