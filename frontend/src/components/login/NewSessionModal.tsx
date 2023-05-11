import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "components/common/store";
import { LoginStatusActionTypes } from "types/redux/Login";
import "styles/global.scss";
import "styles/Login.scss";

import CustomIconButton from "components/utils/CustomIconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { Box } from "@mui/material";

const NewSessionModal = () => {
  const loginStatus = useSelector((state: IRootState) => state.loginStatus);
  const dispatch = useDispatch();

  return (
    <Modal
      open={loginStatus === "new-session"}
      onClose={() => dispatch({ type: LoginStatusActionTypes.STATUS_MAIN })}
    >
      <ModalDialog className="modal" variant="outlined">
        <Box id="inform" className="outframe">
          <Box className="header flex-container">
            <b>중복 로그인 알림</b>
            <CustomIconButton
              class="right"
              icon={<CloseIcon />}
              handleFunction={() =>
                dispatch({ type: LoginStatusActionTypes.STATUS_MAIN })
              }
            />
          </Box>
          <Box className="body flex-container">
            <span>이미 로그인 중인 아이디입니다.</span>
            <b>기존 로그인을 종료하고 새로 로그인하시겠습니까?</b>
          </Box>
          <Box className="footer flex-container">
            <Button onClick={() => {}}>새로 로그인</Button>
          </Box>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

export default NewSessionModal;
