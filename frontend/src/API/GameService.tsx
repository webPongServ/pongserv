import instance from "API/api";

export const gameURL = (path: string = ""): string => {
  return `/games/${path}`;
};

const GameService = {
  getGameRooms: async () => await instance.get(gameURL("normal/rooms")),
};

export default GameService;
