import instance from "API/api";

export const usersURL = (path: string = ""): string => {
  return `/users/${path}`;
};

const UserService = {
  getLogin: async () => await instance.get(usersURL("login")),
  getMe: async () => await instance.get(usersURL("me")),
  getUserProfile: async (nickname: string) =>
    await instance.get(usersURL(`profile?friendNickname=${nickname}`)),
  getNicknameDup: async (newNickname: string) =>
    await instance.get(usersURL(`nickname?new=${newNickname}`)),
  postNewNickname: async (body: { nickname: string }) =>
    await instance.post(usersURL("nickname"), body),
  postNewImage: async (body: {
    base64Data: string | ArrayBuffer | null | undefined;
  }) => await instance.post(usersURL("image"), body),
  getFriend: async () => await instance.get(usersURL("friend")),
  postFriend: async (body: { nickname: string }) =>
    await instance.post(usersURL("friend"), body),
  postDeleteFriend: async (body: { nickname: string }) =>
    await instance.post(usersURL("friend/delete"), body),
  getSearchedUser: async (search: string) =>
    await instance.get(usersURL(`list?search=${search}`)),
  getGameHistory: async (friendNickname: string) =>
    await instance.get(
      usersURL(`gamehistory?friendNickname=${friendNickname}`)
    ),
  getAchievement: async (friendNickname: string) =>
    await instance.get(
      usersURL(`achievement?friendNickname=${friendNickname}`)
    ),
};

export default UserService;
