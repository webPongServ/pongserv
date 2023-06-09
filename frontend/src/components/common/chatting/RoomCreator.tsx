import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChattingRoomForm } from "types/Form";
import { CurrentChattingActionTypes } from "types/redux/CurrentChatting";
import { IRootState } from "components/common/store";
import CustomInput from "components/utils/CustomInput";
import CustomSlider from "components/utils/CustomSlider";
import ChattingTypeSelect from "components/utils/ChattingTypeSelect";
import CustomIconButton from "components/utils/CustomIconButton";
import { ChattingRoomType, ChattingUserRoleType } from "constant";
import "styles/global.scss";
import "styles/ChattingDrawer.scss";

import { Box } from "@mui/material";
import { Button } from "@mui/joy";
import CloseIcon from "@mui/icons-material/Close";

const RoomCreator = () => {
  const myInfo = useSelector((state: IRootState) => state.myInfo);
  const chattingSocket: any = useSelector(
    (state: IRootState) => state.sockets.chattingSocket!
  );
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [chattingRoomForm, setChattingRoomForm] = useState<ChattingRoomForm>({
    chatroomName: "",
    maxCount: 2,
    type: ChattingRoomType.public,
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

  const createChattingRoom = async () => {
    if (chattingRoomForm.chatroomName.length === 0)
      return alert("제목을 입력해주세요!");
    else if (
      chattingRoomForm.type === ChattingRoomType.protected &&
      chattingRoomForm.password.length === 0
    )
      return alert("비밀번호를 입력해주세요!");

    chattingSocket.emit(
      "chatroomCreation",
      {
        name: chattingRoomForm.chatroomName,
        type: chattingRoomForm.type,
        max: chattingRoomForm.maxCount,
        pwd: chattingRoomForm.password,
      },
      (response: { chtrmId: string }) => {
        dispatch({
          type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING,
          payload: {
            id: response.chtrmId,
            chatroomName: chattingRoomForm.chatroomName,
            ownerNickname: myInfo.nickname,
            type: chattingRoomForm.type,
            maxCount: chattingRoomForm.maxCount,
            currentCount: 1,
            isAlrdyAttnd: false,
          },
        });
        dispatch({
          type: CurrentChattingActionTypes.ADD_MYDETAIL,
          payload: {
            nickname: myInfo.nickname,
            imgURL: myInfo.imgURL,
            role: ChattingUserRoleType.owner,
          },
        });
      }
    );
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
        <CustomInput
          name="제목"
          defaultValue=""
          maxLength={20}
          placeholder="최대 20자"
          handleFunction={handleTitle}
        />
        <CustomSlider
          name="최대 인원"
          defaultValue={2}
          min={2}
          max={10}
          handleFunction={handleMax}
        />
        <ChattingTypeSelect
          name="채팅방 유형"
          defaultValue="공개"
          setIsPublic={setIsPublic}
          handleFunction={handleType}
        />
        {isPublic ? null : (
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
        <Button onClick={createChattingRoom}>생성</Button>
      </Box>
    </Box>
  );
};

export default RoomCreator;
