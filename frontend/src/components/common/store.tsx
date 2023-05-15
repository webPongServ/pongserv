import { combineReducers, createStore } from "redux";
import { MyInfoReducer } from "types/redux/MyInfo";
import { FriendsReducer } from "types/redux/Friends";
import { CurrentChattingReducer } from "types/redux/CurrentChatting";
import { GameRoomsReducer } from "types/redux/GameRooms";
import { LoginStatusReducer } from "types/redux/Login";
import { SocketsReducer } from "types/redux/Sockets";

const rootReducer = combineReducers({
  loginStatus: LoginStatusReducer,
  myInfo: MyInfoReducer,
  friends: FriendsReducer,
  currentChatting: CurrentChattingReducer,
  // currentGame: CurrentGameReducer,
  gameRooms: GameRoomsReducer,
  sockets: SocketsReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
