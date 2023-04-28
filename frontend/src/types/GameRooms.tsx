import { GameRoomDetail } from "./Detail";

export interface GameRooms {
  gameRooms: GameRoomDetail[];
}

const INITIAL_GAMEROOMS: GameRooms = {
  gameRooms: [
    {
      id: "202304250001",
      title: "chanhyle님의 게임방",
      owner: "chanhyle",
      maxScore: 10,
      difficulty: "easy",
      createdAt: new Date(),
    },
    {
      id: "202304250002",
      title: "옥상으로 따라와",
      owner: "seongtki",
      maxScore: 5,
      difficulty: "hard",
      createdAt: new Date(),
    },
  ],
};

export enum GameRoomsActionTypes {
  GET = "GET",
  ADD = "ADD",
  DELETE = "DELETE",
}

export interface GameRoomsGetAction {
  type: GameRoomsActionTypes.GET;
  payload: GameRooms;
}
export interface GameRoomsAddAction {
  type: GameRoomsActionTypes.ADD;
  payload: GameRoomDetail;
}

export interface GameRoomsDeleteAction {
  type: GameRoomsActionTypes.DELETE;
  payload: string;
}

type GameRoomsAction =
  | GameRoomsGetAction
  | GameRoomsAddAction
  | GameRoomsDeleteAction;

export const GameRoomsReducer = (
  state = INITIAL_GAMEROOMS,
  action: GameRoomsAction
): GameRooms => {
  switch (action.type) {
    case GameRoomsActionTypes.GET:
      return action.payload;
    case GameRoomsActionTypes.ADD:
      return {
        ...state,
        gameRooms: [...state.gameRooms, action.payload],
      };
    case GameRoomsActionTypes.DELETE:
      return {
        ...state,
        gameRooms: state.gameRooms.filter(
          (gameRoom) => gameRoom.id !== action.payload
        ),
      };
    default:
      return state;
  }
};
