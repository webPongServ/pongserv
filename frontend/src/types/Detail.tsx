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
