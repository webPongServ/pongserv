export interface CurrentGame {
  id: string | null;
}

const INITIAL_CURRENTGAME: CurrentGame = {
  id: null,
};

export enum CurrentGameActionTypes {
  UPDATE_GAMEID = "UPDATE_GAMEID",
  DELETE_GAMEID = "DELETE_GAMEID",
}

export interface CurrentGame_UpdateGameIdAction {
  type: CurrentGameActionTypes.UPDATE_GAMEID;
  payload: string;
}
export interface CurrentGame_DeleteGameIdAction {
  type: CurrentGameActionTypes.DELETE_GAMEID;
  payload: string;
}

type CurrentGameAction =
  | CurrentGame_UpdateGameIdAction
  | CurrentGame_DeleteGameIdAction;

export const CurrentGameReducer = (
  state = INITIAL_CURRENTGAME,
  action: CurrentGameAction
): CurrentGame => {
  switch (action.type) {
    case CurrentGameActionTypes.UPDATE_GAMEID:
      return { id: action.payload };
    case CurrentGameActionTypes.DELETE_GAMEID:
      return { id: null };
    default:
      return state;
  }
};
