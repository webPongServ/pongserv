import { ChattingRoomDetail } from "types/Detail";

export interface ChattingRooms {
  chattingRooms: ChattingRoomDetail[];
}

const INITIAL_CHATROOMS: ChattingRooms = {
  chattingRooms: [
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

export enum ChattingRoomsActionTypes {
  CHATTINGROOMS_GET = "CHATTINGROOMS_GET",
  CHATTINGROOMS_ADD = "CHATTINGROOMS_ADD",
  CHATTINGROOMS_DELETE = "CHATTINGROOMS_DELETE",
}

export interface ChattingRoomsGetAction {
  type: ChattingRoomsActionTypes.CHATTINGROOMS_GET;
  payload: ChattingRooms;
}
export interface ChattingRoomsAddAction {
  type: ChattingRoomsActionTypes.CHATTINGROOMS_ADD;
  payload: ChattingRoomDetail;
}

export interface ChattingRoomsDeleteAction {
  type: ChattingRoomsActionTypes.CHATTINGROOMS_DELETE;
  payload: string;
}

type ChattingRoomsAction =
  | ChattingRoomsGetAction
  | ChattingRoomsAddAction
  | ChattingRoomsDeleteAction;

export const ChattingRoomsReducer = (
  state = INITIAL_CHATROOMS,
  action: ChattingRoomsAction
): ChattingRooms => {
  switch (action.type) {
    case ChattingRoomsActionTypes.CHATTINGROOMS_GET:
      return action.payload;
    case ChattingRoomsActionTypes.CHATTINGROOMS_ADD:
      return {
        ...state,
        chattingRooms: [...state.chattingRooms, action.payload],
      };
    case ChattingRoomsActionTypes.CHATTINGROOMS_DELETE:
      return {
        ...state,
        chattingRooms: state.chattingRooms.filter(
          (chattingRoom) => chattingRoom.id !== action.payload
        ),
      };
    default:
      return state;
  }
};
