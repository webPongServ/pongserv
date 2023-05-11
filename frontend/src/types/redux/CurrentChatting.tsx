import { ChattingUserDetail, ChattingRoomDetail } from "types/Detail";
import { ChattingRoomEditForm } from "types/Form";

export interface CurrentChatting {
  status: string;
  chattingRoom: ChattingRoomDetail | null;
  userList: ChattingUserDetail[];
  banList: ChattingUserDetail[];
}

const INITIAL_CURRENTCHATTING: CurrentChatting = {
  status: "waiting",
  chattingRoom: null,
  userList: [],
  banList: [],
};

export enum CurrentChattingActionTypes {
  UPDATE_STATUS_WAITING = "UPDATE_STATUS_WAITING",
  UPDATE_STATUS_CREATING = "UPDATE_STATUS_CREATING",
  UPDATE_STATUS_CHATTING = "UPDATE_STATUS_CHATTING",
  EDIT_CHATTINGROOM = "EDIT_CHATTINGROOM",
  EDIT_CHATTING = "EDIT_CHATTING",
  GET_USERLIST = "GET_USERLIST",
  ADD_USERLIST = "ADD_USERLIST",
  DELETE_USERLIST = "DELETE_USERLIST",
  GET_BANLIST = "GET_BANLIST",
  ADD_BANLIST = "ADD_BANLIST",
  DELETE_BANLIST = "DELETE_BANLIST",
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

export interface CurrentChatting_GetUserListAction {
  type: CurrentChattingActionTypes.GET_USERLIST;
  payload: ChattingUserDetail[];
}

export interface CurrentChatting_AddUserListAction {
  type: CurrentChattingActionTypes.ADD_USERLIST;
  payload: ChattingUserDetail;
}

export interface CurrentChatting_DeleteUserListAction {
  type: CurrentChattingActionTypes.DELETE_USERLIST;
  payload: string;
}
export interface CurrentChatting_GetBanListAction {
  type: CurrentChattingActionTypes.GET_BANLIST;
  payload: ChattingUserDetail[];
}

export interface CurrentChatting_AddBanListAction {
  type: CurrentChattingActionTypes.ADD_BANLIST;
  payload: ChattingUserDetail;
}

export interface CurrentChatting_DeleteBanListAction {
  type: CurrentChattingActionTypes.DELETE_BANLIST;
  payload: string;
}

type CurrentChattingAction =
  | CurrentChatting_UpdateStatusWaitingAction
  | CurrentChatting_UpdateStatusChattingAction
  | CurrentChatting_UpdateStatusCreatingAction
  | CurrentChatting_EditChattingRoomAction
  | CurrentChatting_GetUserListAction
  | CurrentChatting_AddUserListAction
  | CurrentChatting_DeleteUserListAction
  | CurrentChatting_GetBanListAction
  | CurrentChatting_AddBanListAction
  | CurrentChatting_DeleteBanListAction;

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
          ...state.chattingRoom!,
          chatroomName: action.payload.chatroomName,
          type: action.payload.type,
          maxCount: action.payload.maxCount,
        },
      };
    case CurrentChattingActionTypes.GET_USERLIST:
      return {
        ...state,
        userList: action.payload,
      };
    case CurrentChattingActionTypes.ADD_USERLIST:
      return {
        ...state,
        userList: [...state.userList, action.payload],
      };
    case CurrentChattingActionTypes.DELETE_USERLIST:
      return {
        ...state,
        userList: state.userList.filter(
          (value) => value.nickname !== action.payload
        ),
      };
    case CurrentChattingActionTypes.GET_BANLIST:
      return {
        ...state,
        banList: action.payload,
      };
    case CurrentChattingActionTypes.ADD_BANLIST:
      return {
        ...state,
        banList: [...state.banList, action.payload],
      };
    case CurrentChattingActionTypes.DELETE_BANLIST:
      return {
        ...state,
        banList: state.banList.filter(
          (value) => value.nickname !== action.payload
        ),
      };
    default:
      return state;
  }
};
