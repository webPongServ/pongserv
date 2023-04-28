import { combineReducers, createStore } from "redux";
import { MyInfoReducer } from "types/MyInfo";
import { FriendsReducer } from "types/Friends";
import { CurrentChattingReducer } from "types/CurrentChatting";
import { GameRoomsReducer } from "types/GameRooms";

const rootReducer = combineReducers({
  myInfo: MyInfoReducer,
  friends: FriendsReducer,
  currentChatting: CurrentChattingReducer,
  gameRooms: GameRoomsReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
