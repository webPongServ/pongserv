import { UserDetail } from "types/Detail";

const INITIAL_MYINFO: UserDetail = {
  nickname: "susong",
  imgURL: "../image.png",
  status: "login",
};

export enum MyInfoActionTypes {
  MYINFO_UPDATE = "MYINFO_UPDATE",
  MYINFO_REMOVE = "MYINFO_REMOVE",
}

export interface MyInfoUpdateAction {
  type: MyInfoActionTypes.MYINFO_UPDATE;
  payload: UserDetail;
}

export interface MyInfoRemoveAction {
  type: MyInfoActionTypes.MYINFO_REMOVE;
  payload: UserDetail;
}

type MyInfoAction = MyInfoUpdateAction | MyInfoRemoveAction;

export const MyInfoReducer = (
  state: UserDetail = INITIAL_MYINFO,
  action: MyInfoAction
): UserDetail => {
  switch (action.type) {
    case MyInfoActionTypes.MYINFO_UPDATE:
      return action.payload;
    case MyInfoActionTypes.MYINFO_REMOVE:
      return INITIAL_MYINFO;
    default:
      return state;
  }
};
