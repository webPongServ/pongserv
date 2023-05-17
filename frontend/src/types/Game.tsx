import { GameRoomDetail } from "types/Detail";

export interface GameCardProps {
  gameDetail: GameRoomDetail;
  setRoomStatus: Function;
  setSelectedRoom: Function;
}
