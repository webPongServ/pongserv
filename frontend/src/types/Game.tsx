import { UserDetail } from "types/Detail";

export interface GameCardProps {
  id: string;
  title: string;
  owner: UserDetail;
  maxScore: number;
  difficulty: string;
  setRoomStatus: Function;
  setSelectedID: Function;
}
