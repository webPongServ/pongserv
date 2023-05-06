import instance from "API/api";

export const usersURL = (path: string = ""): string => {
  return `/users/${path}`;
};

const UserService = {
  getMe: async () => await instance.get(usersURL("me")),
};

export default UserService;
