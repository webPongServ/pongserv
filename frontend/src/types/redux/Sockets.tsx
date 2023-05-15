interface Sockets {
  chattingSocket: any;
  gameSocket: any;
}

const INITIAL_GAMESOCKET: Sockets = {
  chattingSocket: null,
  gameSocket: null,
};

export enum SocketsActionTypes {
  CHATTINGSOCKET_UPDATE = "CHATTINGSOCKET_UPDATE",
  CHATTINGSOCKET_DELETE = "CHATTINGSOCKET_DELETE",
  GAMESOCKET_UPDATE = "GAMESOCKET_UPDATE",
  GAMESOCKET_DELETE = "GAMESOCKET_DELETE",
}

export interface ChattingSocketUpdateAction {
  type: SocketsActionTypes.CHATTINGSOCKET_UPDATE;
  payload: any;
}

export interface ChattingSocketDeletAction {
  type: SocketsActionTypes.CHATTINGSOCKET_DELETE;
  payload: any;
}

export interface GameSocketUpdateAction {
  type: SocketsActionTypes.GAMESOCKET_UPDATE;
  payload: any;
}

export interface GameSocketDeletAction {
  type: SocketsActionTypes.GAMESOCKET_DELETE;
  payload: any;
}

type SocketsAction =
  | ChattingSocketUpdateAction
  | ChattingSocketDeletAction
  | GameSocketUpdateAction
  | GameSocketDeletAction;

export const SocketsReducer = (
  state = INITIAL_GAMESOCKET,
  action: SocketsAction
): Sockets => {
  switch (action.type) {
    case SocketsActionTypes.CHATTINGSOCKET_UPDATE:
      return { ...state, chattingSocket: action.payload };
    case SocketsActionTypes.CHATTINGSOCKET_DELETE:
      return { ...state, chattingSocket: null };
    case SocketsActionTypes.GAMESOCKET_UPDATE:
      return { ...state, gameSocket: action.payload };
    case SocketsActionTypes.GAMESOCKET_DELETE:
      return { ...state, gameSocket: null };
    default:
      return state;
  }
};
