export interface ChatRoomForm {
  title: string;
  max: number;
  type: string;
  password: string;
}

export interface ChatRoomEditForm {
  title: string;
  max: number;
  type: string;
}

export interface GameRoomForm {
  title: string;
  maxScore: number;
  difficulty: string;
}
