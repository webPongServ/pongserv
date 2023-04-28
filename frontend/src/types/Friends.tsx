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
  GET = "GET",
  ADD = "ADD",
  DELETE = "DELETE",
}

export interface FriendsGetAction {
  type: FriendsActionTypes.GET;
  payload: Friends;
}
export interface FriendsAddAction {
  type: FriendsActionTypes.ADD;
  payload: UserDetail;
}

export interface FriendsDeleteAction {
  type: FriendsActionTypes.DELETE;
  payload: string;
}

type FriendsAction = FriendsGetAction | FriendsAddAction | FriendsDeleteAction;

export const FriendsReducer = (
  state = INITIAL_FRIENDS,
  action: FriendsAction
): Friends => {
  switch (action.type) {
    case FriendsActionTypes.GET:
      return action.payload;
    case FriendsActionTypes.ADD:
      return {
        ...state,
        friends: [...state.friends, action.payload],
      };
    case FriendsActionTypes.DELETE:
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