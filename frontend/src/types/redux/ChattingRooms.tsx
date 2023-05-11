import { ChattingRoomDetail } from "types/Detail";

export interface ChattingRooms {
  chattingRooms: ChattingRoomDetail[] | null;
}

const INITIAL_CHATROOMS: ChattingRooms = {
  chattingRooms: null,
};

export enum ChattingRoomsActionTypes {
  CHATTINGROOMS_GET = "CHATTINGROOMS_GET",
  CHATTINGROOMS_ADD = "CHATTINGROOMS_ADD",
  CHATTINGROOMS_DELETE = "CHATTINGROOMS_DELETE",
}

export interface ChattingRoomsGetAction {
  type: ChattingRoomsActionTypes.CHATTINGROOMS_GET;
  payload: ChattingRoomDetail[];
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
      return { chattingRooms: action.payload };
    case ChattingRoomsActionTypes.CHATTINGROOMS_ADD:
      return {
        ...state,
        chattingRooms: [...state.chattingRooms!, action.payload],
      };
    case ChattingRoomsActionTypes.CHATTINGROOMS_DELETE:
      return {
        ...state,
        chattingRooms: state.chattingRooms!.filter(
          (chattingRoom) => chattingRoom.id !== action.payload
        ),
      };
    default:
      return state;
  }
};
