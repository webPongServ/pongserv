export interface GameCardProps {
  id: string;
  title: string;
  owner: string;
  maxScore: number;
  difficulty: string;
  createdAt: Date;
  setRoomStatus: Function;
  setSelectedID: Function;
}
