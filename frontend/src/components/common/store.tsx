import { combineReducers, createStore } from "redux";
import { MyInfoReducer } from "./type/MyInfo";
import { FriendsReducer } from "components/common/type/Friends";

const rootReducer = combineReducers({
  myInfo: MyInfoReducer,
  friends: FriendsReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
