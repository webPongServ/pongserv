import instance from "API/api";

export const authURL = (path: string = ""): string => {
  return `/auth/${path}`;
};

const LoginService = {
  postCode: async (body: { code: string }) =>
    await instance.post(authURL("code"), body),
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