import { combineReducers, createStore } from "redux";
import { MyInfoReducer } from "types/redux/MyInfo";
import { FriendsReducer } from "types/redux/Friends";
import { CurrentChattingReducer } from "types/redux/CurrentChatting";
import { GameRoomsReducer } from "types/redux/GameRooms";

const rootReducer = combineReducers({
  myInfo: MyInfoReducer,
  friends: FriendsReducer,
  currentChatting: CurrentChattingReducer,
  gameRooms: GameRoomsReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
