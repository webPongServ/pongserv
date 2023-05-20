export interface History {
  isWin: boolean;
  isDodge: boolean;
  myNick: string;
  myImg: string;
  myScore: number;
  opNick: string;
  opImg: string;
  opScore: number;
  type: string;
}

export type Achievement = {
  achvTitle: string;
  achvContent: string;
  achvImg: string;
};
