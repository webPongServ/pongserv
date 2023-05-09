export interface ChattingRoomForm {
  title: string;
  max: number;
  type: string;
  password: string;
}

export interface ChattingRoomEditForm {
  title: string;
  max: number;
  type: string;
}

export interface GameRoomForm {
  title: string;
  maxScore: number;
  difficulty: string;
}
