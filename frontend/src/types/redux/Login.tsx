const INITIAL_LOGINSTATUS = "main";

export enum LoginStatusActionTypes {
  STATUS_MAIN = "STATUS_MAIN",
  STATUS_TWOFACTOR = "STATUS_TWOFACTOR",
  STATUS_NEWSESSION = "STATUS_NEWSESSION",
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

type LoginStatusAction =
  | LoginStatusMainAction
  | LoginStatusTwoFactorAction
  | LoginStatusNewSessionAction;

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
    default:
      return state;
  }
};
