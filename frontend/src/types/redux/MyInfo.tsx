import { UserDetail } from "types/Detail";

// null로 만들기
const INITIAL_MYINFO: UserDetail = {
  nickname: "",
  imgURL: "",
  status: "",
};

export enum MyInfoActionTypes {
  MYINFO_UPDATE = "MYINFO_UPDATE",
  MYINFO_UPDATE_NICKNAME = "MYINFO_UPDATE_NICKNAME",
  MYINFO_UPDATE_IMAGE = "MYINFO_UPDATE_IMAGE",
  MYINFO_REMOVE = "MYINFO_REMOVE",
}

export interface MyInfoUpdateAction {
  type: MyInfoActionTypes.MYINFO_UPDATE;
  payload: UserDetail;
}
export interface MyInfoUpdateNicknameAction {
  type: MyInfoActionTypes.MYINFO_UPDATE_NICKNAME;
  payload: string;
}
export interface MyInfoUpdateImageAction {
  type: MyInfoActionTypes.MYINFO_UPDATE_IMAGE;
  payload: string;
}

export interface MyInfoRemoveAction {
  type: MyInfoActionTypes.MYINFO_REMOVE;
  payload: UserDetail;
}

type MyInfoAction =
  | MyInfoUpdateAction
  | MyInfoUpdateNicknameAction
  | MyInfoUpdateImageAction
  | MyInfoRemoveAction;

export const MyInfoReducer = (
  state: UserDetail = INITIAL_MYINFO,
  action: MyInfoAction
): UserDetail => {
  switch (action.type) {
    case MyInfoActionTypes.MYINFO_UPDATE:
      return action.payload;
    case MyInfoActionTypes.MYINFO_UPDATE_NICKNAME:
      return { ...state, nickname: action.payload };
    case MyInfoActionTypes.MYINFO_UPDATE_IMAGE:
      return { ...state, imgURL: action.payload };
    case MyInfoActionTypes.MYINFO_REMOVE:
      return INITIAL_MYINFO;
    default:
      return state;
  }
};
