import { ChatRoomDetail } from "./Detail";

export interface ChatRooms {
  chatRooms: ChatRoomDetail[];
}

const INITIAL_CHATROOMS: ChatRooms = {
  chatRooms: [
    {
      id: "202304230001",
      title: "이기면 100만원~",
      owner: "noname_12",
      type: "public",
      current: 4,
      max: 5,
      createdAt: new Date(),
    },
    {
      id: "202304230002",
      title: "옥상으로 따라와",
      owner: "mgo",
      type: "protected",
      current: 4,
      max: 9,
      createdAt: new Date(),
    },
    {
      id: "202304230003",
      title: "[DM] mgo님과의 채팅방",
      owner: "mgo",
      type: "private",
      current: 1,
      max: 2,
      createdAt: new Date(),
    },
  ],
};

export enum ChatRoomsActionTypes {
  CHATROOMS_GET = "CHATROOMS_GET",
  CHATROOMS_ADD = "CHATROOMS_ADD",
  CHATROOMS_DELETE = "CHATROOMS_DELETE",
}

export interface ChatRoomsGetAction {
  type: ChatRoomsActionTypes.CHATROOMS_GET;
  payload: ChatRooms;
}
export interface ChatRoomsAddAction {
  type: ChatRoomsActionTypes.CHATROOMS_ADD;
  payload: ChatRoomDetail;
}

export interface ChatRoomsDeleteAction {
  type: ChatRoomsActionTypes.CHATROOMS_DELETE;
  payload: string;
}

type ChatRoomsAction =
  | ChatRoomsGetAction
  | ChatRoomsAddAction
  | ChatRoomsDeleteAction;

export const ChatRoomsReducer = (
  state = INITIAL_CHATROOMS,
  action: ChatRoomsAction
): ChatRooms => {
  switch (action.type) {
    case ChatRoomsActionTypes.CHATROOMS_GET:
      return action.payload;
    case ChatRoomsActionTypes.CHATROOMS_ADD:
      return {
        ...state,
        chatRooms: [...state.chatRooms, action.payload],
      };
    case ChatRoomsActionTypes.CHATROOMS_DELETE:
      return {
        ...state,
        chatRooms: state.chatRooms.filter(
          (chatRoom) => chatRoom.id !== action.payload
        ),
      };
    default:
      return state;
  }
};
