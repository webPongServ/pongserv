import instance from "API/api";

export const usersURL = (path: string = ""): string => {
  return `/users/${path}`;
};

const UserService = {
  getMe: async () => await instance.get(usersURL("me")),
  getUserProfile: async (nickname: string) =>
    await instance.get(usersURL(`profile?friendNickname=${nickname}`)),
};

export default UserService;
