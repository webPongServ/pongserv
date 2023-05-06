import instance from "API/api";

export const usersURL = (path: string = ""): string => {
  return `/users/${path}`;
};

const UserService = {
  //   login: {
  // reissueAccessToken: async () => await refresh.patch(loginUrl(`/token`)),
  //   },
  //   login42: {
  //     issueAccessToken: async (code) =>
  //       await instance.post(loginUrl(`/token?code=${code}`)),
  //     // reissueAccessToken: async () => await refreshft.patch(login42Url(`/token`)),
  //   },
};

export default UserService;
