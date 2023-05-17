import { UserDetail } from "types/Detail";

export interface Friends {
  friends: UserDetail[] | null;
}

const INITIAL_FRIENDS: Friends = {
  friends: null,
};

export enum FriendsActionTypes {
  FRIENDS_GET = "FRIENDS_GET",
  FRIENDS_ADD = "FRIENDS_ADD",
  FRIENDS_DELETE = "FRIENDS_DELETE",
  FRIENDS_UPDATE_STATUS = "FRIENDS_UPDATE_STATUS",
}

export interface FriendsGetAction {
  type: FriendsActionTypes.FRIENDS_GET;
  payload: UserDetail[];
}
export interface FriendsAddAction {
  type: FriendsActionTypes.FRIENDS_ADD;
  payload: UserDetail;
}

export interface FriendsDeleteAction {
  type: FriendsActionTypes.FRIENDS_DELETE;
  payload: string;
}

export interface FriendsUpdateStatusAction {
  type: FriendsActionTypes.FRIENDS_UPDATE_STATUS;
  payload: {
    nickname: string;
    status: string;
  };
}

type FriendsAction =
  | FriendsGetAction
  | FriendsAddAction
  | FriendsDeleteAction
  | FriendsUpdateStatusAction;

export const FriendsReducer = (
  state = INITIAL_FRIENDS,
  action: FriendsAction
): Friends => {
  switch (action.type) {
    case FriendsActionTypes.FRIENDS_GET:
      return { friends: action.payload }; // { friends : [] }를 리턴해야 함
    case FriendsActionTypes.FRIENDS_ADD:
      return {
        friends: [...state.friends!, action.payload],
      };
    case FriendsActionTypes.FRIENDS_DELETE:
      return {
        friends: state.friends!.filter(
          (friend) => friend.nickname !== action.payload
        ),
      };
    case FriendsActionTypes.FRIENDS_UPDATE_STATUS:
      return {
        friends: state.friends!.map((value) => {
          if (value.nickname === action.payload.nickname)
            return { ...value, status: action.payload.status };
          return value;
        }),
      };
    default:
      return state;
  }
};
