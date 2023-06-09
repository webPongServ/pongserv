export interface ChattingRoomForm {
  chatroomName: string;
  maxCount: number;
  type: string;
  password: string;
}

export interface ChattingRoomEditForm {
  chatroomName: string;
  maxCount: number;
  type: string;
}

export interface GameRoomForm {
  title: string;
  maxScore: number;
  difficulty: string;
}
