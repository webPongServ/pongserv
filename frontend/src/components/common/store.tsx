import { combineReducers, createStore } from "redux";
import { MyInfoReducer } from "types/MyInfo";
import { FriendsReducer } from "types/Friends";

const rootReducer = combineReducers({
  myInfo: MyInfoReducer,
  friends: FriendsReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
