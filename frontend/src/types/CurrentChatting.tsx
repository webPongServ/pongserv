import { UserDetail, ChatRoomDetail } from "./Detail";

export interface CurrentChatting {
  status: string;
  chatRoom: ChatRoomDetail;
  userList: UserDetail[];
  banList: UserDetail[];
}

const INITIAL_CURRENTCHATTING: CurrentChatting = {
  status: "waiting",
  chatRoom: {
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

export enum CurrentChattingTypes {
  UPDATE_STATUS_WAITING = "UPDATE_STATUS_WAITING",
  UPDATE_STATUS_CREATING = "UPDATE_STATUS_CREATING",
  UPDATE_STATUS_CHATTING = "UPDATE_STATUS_CHATTING",
  GET_USERLIST = "GET_USERLIST",
  ADD_USERLIST = "ADD_USERLIST",
  DELETE_USERLIST = "DELETE_USERLIST",
  GET_BANLIST = "GET_BANLIST",
  ADD_BANLIST = "ADD_BANLIST",
  DELETE_BANLIST = "DELETE_BANLIST",
}

export interface CurrentChatting_UpdateStatusWaitingAction {
  type: CurrentChattingTypes.UPDATE_STATUS_WAITING;
  payload: string;
}
export interface CurrentChatting_UpdateStatusCreatingAction {
  type: CurrentChattingTypes.UPDATE_STATUS_CREATING;
  payload: string;
}

export interface CurrentChatting_UpdateStatusChattingAction {
  type: CurrentChattingTypes.UPDATE_STATUS_CHATTING;
  payload: ChatRoomDetail;
}

type CurrentChattingAction =
  | CurrentChatting_UpdateStatusWaitingAction
  | CurrentChatting_UpdateStatusChattingAction
  | CurrentChatting_UpdateStatusCreatingAction;

export const CurrentChattingReducer = (
  state = INITIAL_CURRENTCHATTING,
  action: CurrentChattingAction
): CurrentChatting => {
  switch (action.type) {
    case CurrentChattingTypes.UPDATE_STATUS_WAITING:
      return INITIAL_CURRENTCHATTING;
    case CurrentChattingTypes.UPDATE_STATUS_CREATING:
      return {
        ...state,
        status: "creating",
      };
    case CurrentChattingTypes.UPDATE_STATUS_CHATTING:
      return {
        ...state,
        status: "chatting",
        chatRoom: action.payload,
      };
    default:
      return state;
  }
};
