import { GameRoomDetail } from "types/Detail";

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
    {
      id: "202304250002",
      title: "옥상으로 따라와",
      owner: "seongtki",
      maxScore: 5,
      difficulty: "hard",
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
    {
      id: "202304250002",
      title: "옥상으로 따라와",
      owner: "seongtki",
      maxScore: 5,
      difficulty: "hard",
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
    {
      id: "202304250002",
      title: "옥상으로 따라와",
      owner: "seongtki",
      maxScore: 5,
      difficulty: "hard",
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
    {
      id: "202304250002",
      title: "옥상으로 따라와",
      owner: "seongtki",
      maxScore: 5,
      difficulty: "hard",
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
  GAMEROOMS_GET = "GAMEROOMS_GET",
  GAMEROOMS_ADD = "GAMEROOMS_ADD",
  GAMEROOMS_DELETE = "GAMEROOMS_DELETE",
}

export interface GameRoomsGetAction {
  type: GameRoomsActionTypes.GAMEROOMS_GET;
  payload: GameRooms;
}
export interface GameRoomsAddAction {
  type: GameRoomsActionTypes.GAMEROOMS_ADD;
  payload: GameRoomDetail;
}

export interface GameRoomsDeleteAction {
  type: GameRoomsActionTypes.GAMEROOMS_DELETE;
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
    case GameRoomsActionTypes.GAMEROOMS_GET:
      return action.payload;
    case GameRoomsActionTypes.GAMEROOMS_ADD:
      return {
        ...state,
        gameRooms: [...state.gameRooms, action.payload],
      };
    case GameRoomsActionTypes.GAMEROOMS_DELETE:
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
