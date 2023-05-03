export interface UserDetail {
  nickname: string;
  imgURL: string;
  status: string;
}

export interface ChatRoomDetail {
  id: string;
  title: string;
  owner: string;
  type: string;
  current: number;
  max: number;
  createdAt: Date;
}

export interface ChatUserDetail {
  nickname: string;
  imgURL: string;
  role: string;
}

export interface GameRoomDetail {
  id: string;
  title: string;
  owner: string;
  maxScore: number;
  difficulty: string;
  createdAt: Date;
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
