import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomIconButton from "components/utils/CustomIconButton";
import { IRootState } from "components/common/store";
import CustomProfilePreview from "components/utils/CustomProfilePreview";
import { CurrentGameActionTypes } from "types/redux/CurrentGame";
import { GameDifficultyType } from "constant";
import "styles/Game.scss";

import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { RequesterDetail } from "types/Detail";

interface RequestGameModalProps {
  openModal: boolean;
  setOpenModal: Function;
  requester: RequesterDetail;
}

const RequestGameModal = (props: RequestGameModalProps) => {
  const gameSocket = useSelector(
    (state: IRootState) => state.sockets.gameSocket
  );
  const chattinSocket = useSelector(
    (state: IRootState) => state.sockets.chattingSocket
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClose = () => {
    chattinSocket.emit(
      "chatroomResponseGame",
      {
        gmRmId: props.requester.roomId,
        rqstrNick: props.requester.nickname,
        isApprv: false,
      },
      () => {
        props.setOpenModal(false);
      }
    );
  };

  const handleEnterGameRoom = () => {
    dispatch({
      type: CurrentGameActionTypes.UPDATE_GAMEROOM,
      payload: {
        id: props.requester.roomId,
        title: props.requester.nickname + "의 신청 게임",
        owner: props.requester.nickname,
        ownerImage: props.requester.imgURL,
        maxScore: 5,
        difficulty: GameDifficultyType.normal,
      },
    });
    chattinSocket.emit("chatroomResponseGame", {
      gmRmId: props.requester.roomId,
      rqstrNick: props.requester.nickname,
      isApprv: true,
    });
    props.setOpenModal(false);
    navigate(`/game/${props.requester.roomId}`);
  };

  return (
    <Modal open={props.openModal} onClose={handleClose}>
      <ModalDialog className="modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>일반 게임 신청</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={handleClose}
            />
          </Box>
          <Box className="body flex-container">
            <Box>
              <CustomProfilePreview
                class="login"
                nickname={props.requester.nickname}
                imgURL={props.requester.imgURL}
                position="RequestGame"
                handleFunction={() => {}}
              />
            </Box>
            <span>일반 게임 대결을 신청하였습니다.</span>
            <b>대결을 수락하시겠습니까?</b>
          </Box>
          <Box className="footer flex-container">
            <Button onClick={handleEnterGameRoom}>수락</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default RequestGameModal;
