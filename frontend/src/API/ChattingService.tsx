import instance from "API/api";

export const chatsURL = (path: string = ""): string => {
  return `/chats/${path}`;
};

const ChattingService = {
  getChattingRooms: async () => await instance.get(chatsURL("rooms")),
  postNewChattingRoom: async (body: {
    name: string;
    type: boolean;
    pwd: string;
  }) => await instance.post(chatsURL("creation"), body),
  postEntrance: async (body: { uuid: string; pwd: string }) =>
    await instance.post(chatsURL("creation"), body),
  patchChattingRoom: async (body: {
    uuid: string;
    name: string;
    type: string;
    pwd: string;
  }) => await instance.patch(chatsURL("edit"), body),
  getUsersList: async (uuid: string) =>
    await instance.get(chatsURL(`users/${uuid}`)),
  getBansList: async (uuid: string) =>
    await instance.get(chatsURL(`bans/${uuid}`)),
  patchKick: async (body: { uuid: string; userIdToKick: string }) =>
    await instance.patch(chatsURL("kick"), body),
  patchEmpower: async (body: { uuid: string; userIdToEmpower: string }) =>
    await instance.patch(chatsURL("empowerment"), body),
  putBan: async (body: { uuid: string; userIdToBan: string }) =>
    await instance.put(chatsURL("ban"), body),
  putMute: async (body: { uuid: string; userIdToMute: string }) =>
    await instance.put(chatsURL("mute"), body),
  postGameRequest: async (body: { uuid: string; userIdToGame: string }) =>
    await instance.post(chatsURL("game-request"), body),
  patchBanRemove: async (body: { uuid: string; userIdToBan: string }) =>
    await instance.patch(chatsURL("ban-removal"), body),
  postDM: async (body: { targetUserId: string }) =>
    await instance.post(chatsURL("dm"), body),
};

export default ChattingService;
