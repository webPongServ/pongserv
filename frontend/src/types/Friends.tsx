import { UserDetail } from "./Detail";

export interface Friends {
  friends: UserDetail[];
}

const INITIAL_FRIENDS: Friends = {
  friends: [
    { nickname: "chanhyle", imgURL: "../image.png", status: "login" },
    { nickname: "seongtki", imgURL: "../image.png", status: "login" },
    { nickname: "mgo", imgURL: "../image.png", status: "login" },
    { nickname: "noname_12", imgURL: "../image.png", status: "logout" },
  ],
};

export enum FriendsActionTypes {
  FRIENDS_GET = "FRIENDS_GET",
  FRIENDS_ADD = "FRIENDS_ADD",
  FRIENDS_DELETE = "FRIENDS_DELETE",
}

export interface FriendsGetAction {
  type: FriendsActionTypes.FRIENDS_GET;
  payload: Friends;
}
export interface FriendsAddAction {
  type: FriendsActionTypes.FRIENDS_ADD;
  payload: UserDetail;
}

export interface FriendsDeleteAction {
  type: FriendsActionTypes.FRIENDS_DELETE;
  payload: string;
}

type FriendsAction = FriendsGetAction | FriendsAddAction | FriendsDeleteAction;

export const FriendsReducer = (
  state = INITIAL_FRIENDS,
  action: FriendsAction
): Friends => {
  switch (action.type) {
    case FriendsActionTypes.FRIENDS_GET:
      return action.payload;
    case FriendsActionTypes.FRIENDS_ADD:
      return {
        ...state,
        friends: [...state.friends, action.payload],
      };
    case FriendsActionTypes.FRIENDS_DELETE:
      return {
        ...state,
        friends: state.friends.filter(
          (friend) => friend.nickname !== action.payload
        ),
      };
    default:
      return state;
  }
};
