import { UserDetail } from "./Detail";

const INITIAL_MYINFO: UserDetail = {
  nickname: "susong",
  imgURL: "../image.png",
  status: "login",
};

export enum MyInfoActionTypes {
  UPDATE = "UPDATE",
  REMOVE = "REMOVE",
}

export interface MyInfoUpdateAction {
  type: MyInfoActionTypes.UPDATE;
  payload: UserDetail;
}

export interface MyInfoRemoveAction {
  type: MyInfoActionTypes.REMOVE;
  payload: UserDetail;
}

type MyInfoAction = MyInfoUpdateAction | MyInfoRemoveAction;

export const MyInfoReducer = (
  state: UserDetail = INITIAL_MYINFO,
  action: MyInfoAction
): UserDetail => {
  switch (action.type) {
    case MyInfoActionTypes.UPDATE:
      return action.payload;
    case MyInfoActionTypes.REMOVE:
      return INITIAL_MYINFO;
    default:
      return state;
  }
};
