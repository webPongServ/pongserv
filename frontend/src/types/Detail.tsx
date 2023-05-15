export interface UserDetail {
  nickname: string;
  imgURL: string;
  status: string;
}

export interface ChattingRoomDetail {
  id: string;
  chatroomName: string;
  ownerNickname: string;
  type: string;
  currentCount: number;
  maxCount: number;
}

export interface ChattingUserDetail {
  nickname: string;
  imgURL: string;
  role: string;
}

export interface GameRoomDetail {
  id: string;
  title: string;
  owner: UserDetail;
  maxScore: number;
  difficulty: string;
}

export interface ProfileDetail {
  nickname: string;
  imgURL: string;
  total: number;
  win: number;
  lose: number;
  ELO: number;
  winRate: number;
  status: string;
}
