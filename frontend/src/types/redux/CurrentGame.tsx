import { GameRoomDetail } from "types/Detail";

export interface CurrentGame {
  currentGameDetail: GameRoomDetail | null;
  score1: number;
  score2: number;
}

const INITIAL_CURRENTGAME: CurrentGame = {
  currentGameDetail: null,
  score1: 0,
  score2: 0,
};

export enum CurrentGameActionTypes {
  UPDATE_GAMEROOM = "UPDATE_GAMEROOM",
  DELETE_GAMEROOM = "DELETE_GAMEROOM",
  INCREMENT_SCORE = "INCREMENT_SCORE",
}

export interface CurrentGame_UpdateGameRoomAction {
  type: CurrentGameActionTypes.UPDATE_GAMEROOM;
  payload: GameRoomDetail;
}
export interface CurrentGame_DeleteGameRoomAction {
  type: CurrentGameActionTypes.DELETE_GAMEROOM;
  payload: string;
}

export interface CurrentGame_IncrementScore1Action {
  type: CurrentGameActionTypes.INCREMENT_SCORE;
  payload: string;
}

type CurrentGameAction =
  | CurrentGame_UpdateGameRoomAction
  | CurrentGame_DeleteGameRoomAction
  | CurrentGame_IncrementScore1Action;

export const CurrentGameReducer = (
  state = INITIAL_CURRENTGAME,
  action: CurrentGameAction
): CurrentGame => {
  switch (action.type) {
    case CurrentGameActionTypes.UPDATE_GAMEROOM:
      return { ...state, currentGameDetail: action.payload };
    case CurrentGameActionTypes.DELETE_GAMEROOM:
      return { currentGameDetail: null, score1: 0, score2: 0 };
    case CurrentGameActionTypes.INCREMENT_SCORE:
      return action.payload === "score1"
        ? { ...state, score1: state.score1 + 1 }
        : { ...state, score2: state.score2 + 1 };
    default:
      return state;
  }
};
