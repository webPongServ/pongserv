export interface History {
  isWin: boolean;
  myId: number;
  myNick: string;
  myImg: string;
  myScore: number;
  opId: number;
  opNick: string;
  opImg: string;
  opScore: number;
}

export type Achievement = {
  achvTitle: string;
  achvContent: string;
  achvImg: string;
};
