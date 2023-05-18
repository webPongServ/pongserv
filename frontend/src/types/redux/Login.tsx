const INITIAL_LOGINSTATUS = "main";

export enum LoginStatusActionTypes {
  STATUS_MAIN = "STATUS_MAIN",
  STATUS_TWOFACTOR = "STATUS_TWOFACTOR",
  STATUS_NEWSESSION = "STATUS_NEWSESSION",
  STATUS_GAME = "STATUS_GAME",
}

export interface LoginStatusMainAction {
  type: LoginStatusActionTypes.STATUS_MAIN;
}
export interface LoginStatusTwoFactorAction {
  type: LoginStatusActionTypes.STATUS_TWOFACTOR;
}

export interface LoginStatusNewSessionAction {
  type: LoginStatusActionTypes.STATUS_NEWSESSION;
}
export interface LoginStatusGameAction {
  type: LoginStatusActionTypes.STATUS_GAME;
}

type LoginStatusAction =
  | LoginStatusMainAction
  | LoginStatusTwoFactorAction
  | LoginStatusNewSessionAction
  | LoginStatusGameAction;

export const LoginStatusReducer = (
  state = INITIAL_LOGINSTATUS,
  action: LoginStatusAction
): string => {
  switch (action.type) {
    case LoginStatusActionTypes.STATUS_MAIN:
      return "main";
    case LoginStatusActionTypes.STATUS_TWOFACTOR:
      return "two-factor";
    case LoginStatusActionTypes.STATUS_NEWSESSION:
      return "new-session";
    case LoginStatusActionTypes.STATUS_GAME:
      return "game";
    default:
      return state;
  }
};
