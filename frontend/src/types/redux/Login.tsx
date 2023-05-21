const INITIAL_LOGINSTATUS = "main";

export enum LoginStatusActionTypes {
  STATUS_MAIN = "STATUS_MAIN",
  STATUS_FIRSTREGISTER = "STATUS_FIRSTREGISTER",
  STATUS_TWOFACTOR = "STATUS_TWOFACTOR",
  STATUS_GAME = "STATUS_GAME",
}

export interface LoginStatusMainAction {
  type: LoginStatusActionTypes.STATUS_MAIN;
}
export interface LoginStatusTwoFactorAction {
  type: LoginStatusActionTypes.STATUS_TWOFACTOR;
}

export interface LoginStatusFirstRegisterAction {
  type: LoginStatusActionTypes.STATUS_FIRSTREGISTER;
}
export interface LoginStatusGameAction {
  type: LoginStatusActionTypes.STATUS_GAME;
}

type LoginStatusAction =
  | LoginStatusMainAction
  | LoginStatusTwoFactorAction
  | LoginStatusFirstRegisterAction
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
    case LoginStatusActionTypes.STATUS_FIRSTREGISTER:
      return "first-register";
    case LoginStatusActionTypes.STATUS_GAME:
      return "game";
    default:
      return state;
  }
};
