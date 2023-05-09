import { ChattingUserDetail, ChattingRoomDetail } from "types/Detail";
import { ChattingRoomEditForm } from "types/Form";

export interface CurrentChatting {
  status: string;
  chattingRoom: ChattingRoomDetail;
  userList: ChattingUserDetail[];
  banList: ChattingUserDetail[];
}

const INITIAL_CURRENTCHATTING: CurrentChatting = {
  status: "waiting",
  chattingRoom: {
    id: "",
    title: "",
    owner: "",
    type: "",
    max: 0,
    current: 0,
    createdAt: new Date("1970-01-01"),
  },
  userList: [],
  banList: [],
};

export enum CurrentChattingActionTypes {
  UPDATE_STATUS_WAITING = "UPDATE_STATUS_WAITING",
  UPDATE_STATUS_CREATING = "UPDATE_STATUS_CREATING",
  UPDATE_STATUS_CHATTING = "UPDATE_STATUS_CHATTING",
  EDIT_CHATTINGROOM = "EDIT_CHATTINGROOM",
  GET_USERLIST = "GET_USERLIST",
  ADD_USERLIST = "ADD_USERLIST",
  DELETE_USERLIST = "DELETE_USERLIST",
  GET_BANLIST = "GET_BANLIST",
  ADD_BANLIST = "ADD_BANLIST",
  DELETE_BANLIST = "DELETE_BANLIST",
  EDIT_CHATTING = "EDIT_CHATTING",
}

export interface CurrentChatting_UpdateStatusWaitingAction {
  type: CurrentChattingActionTypes.UPDATE_STATUS_WAITING;
  payload: string;
}
export interface CurrentChatting_UpdateStatusCreatingAction {
  type: CurrentChattingActionTypes.UPDATE_STATUS_CREATING;
  payload: string;
}

export interface CurrentChatting_UpdateStatusChattingAction {
  type: CurrentChattingActionTypes.UPDATE_STATUS_CHATTING;
  payload: ChattingRoomDetail;
}

export interface CurrentChatting_EditChattingRoomAction {
  type: CurrentChattingActionTypes.EDIT_CHATTINGROOM;
  payload: ChattingRoomEditForm;
}

type CurrentChattingAction =
  | CurrentChatting_UpdateStatusWaitingAction
  | CurrentChatting_UpdateStatusChattingAction
  | CurrentChatting_UpdateStatusCreatingAction
  | CurrentChatting_EditChattingRoomAction;

export const CurrentChattingReducer = (
  state = INITIAL_CURRENTCHATTING,
  action: CurrentChattingAction
): CurrentChatting => {
  switch (action.type) {
    case CurrentChattingActionTypes.UPDATE_STATUS_WAITING:
      return INITIAL_CURRENTCHATTING;
    case CurrentChattingActionTypes.UPDATE_STATUS_CREATING:
      return {
        ...state,
        status: "creating",
      };
    case CurrentChattingActionTypes.UPDATE_STATUS_CHATTING:
      return {
        ...state,
        status: "chatting",
        chattingRoom: action.payload,
      };
    case CurrentChattingActionTypes.EDIT_CHATTINGROOM:
      return {
        ...state,
        chattingRoom: {
          ...state.chattingRoom,
          title: action.payload.title,
          type: action.payload.type,
          max: action.payload.max,
        },
      };
    default:
      return state;
  }
};
