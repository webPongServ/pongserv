export interface GameCardProps {
  id: string;
  title: string;
  owner: string;
  maxScore: number;
  difficulty: string;
  setRoomStatus: Function;
  setSelectedID: Function;
}
