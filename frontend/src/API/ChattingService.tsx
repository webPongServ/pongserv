import instance from "API/api";

export const chatsURL = (path: string = ""): string => {
  return `/chats/${path}`;
};

const ChattingService = {
  getChattingRooms: async () => await instance.get(chatsURL("rooms")),
  postNewChattingRoom: async (body: {
    name: string;
    type: string;
    max: number;
    pwd: string;
  }) => await instance.post(chatsURL("creation"), body),
  postEntrance: async (body: { id: string; pwd: string }) =>
    await instance.post(chatsURL("entrance"), body),
  postLeaving: async (body: { id: string }) =>
    await instance.post(chatsURL("leaving"), body),
  patchChattingRoom: async (body: {
    id: string;
    name: string;
    type: string;
    max: number;
    pwd: string;
  }) => await instance.patch(chatsURL("edit"), body),
  getUsersList: async (id: string) =>
    await instance.get(chatsURL(`users/${id}`)),
  getBansList: async (id: string) => await instance.get(chatsURL(`bans/${id}`)),
  patchKick: async (body: { id: string; userIdToKick: string }) =>
    await instance.patch(chatsURL("kick"), body),
  patchEmpower: async (body: { id: string; userIdToEmpower: string }) =>
    await instance.patch(chatsURL("empowerment"), body),
  putBan: async (body: { id: string; userIdToBan: string }) =>
    await instance.put(chatsURL("ban"), body),
  putMute: async (body: { id: string; userIdToMute: string }) =>
    await instance.put(chatsURL("mute"), body),
  postGameRequest: async (body: { id: string; userIdToGame: string }) =>
    await instance.post(chatsURL("game-request"), body),
  patchBanRemove: async (body: { id: string; userIdToBan: string }) =>
    await instance.patch(chatsURL("ban-removal"), body),
  postDM: async (body: { targetUserId: string }) =>
    await instance.post(chatsURL("dm"), body),
};

export default ChattingService;
