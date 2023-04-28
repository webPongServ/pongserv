import { combineReducers, createStore } from "redux";
import { MyInfoReducer } from "types/MyInfo";
import { FriendsReducer } from "types/Friends";
// import { ChatRoomsReducer } from "types/ChatRooms";
import { CurrentChattingReducer } from "types/CurrentChatting";

const rootReducer = combineReducers({
  myInfo: MyInfoReducer,
  friends: FriendsReducer,
  // chatRoom: ChatRoomsReducer,
  currentChatting: CurrentChattingReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
