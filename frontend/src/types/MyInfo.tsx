import { UserDetail } from "./UserDetail";

export const INITIAL_MYINFO: UserDetail = {
  nickname: "susong",
  imgURL: "../image.png",
  status: "login",
};

enum MyInfoActionTypes {
  UPDATE = "MYINFO_UPDATE",
  REMOVE = "MYINFO_REMOVE",
}

interface MyInfoUpdateAction {
  type: MyInfoActionTypes.UPDATE;
  payload: UserDetail;
}

interface MyInfoRemoveAction {
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
