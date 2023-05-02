import instance from "API/api";

export const authURL = (path: string = "") => {
  return `/auth/${path}`;
};

const LoginService = {
  //   login: {
  // reissueAccessToken: async () => await refresh.patch(loginUrl(`/token`)),
  //   },
  //   login42: {
  //     issueAccessToken: async (code) =>
  //       await instance.post(loginUrl(`/token?code=${code}`)),
  //     // reissueAccessToken: async () => await refreshft.patch(login42Url(`/token`)),
  //   },
};

export default LoginService;
