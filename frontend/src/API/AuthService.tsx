import instance from "API/api";

export const authURL = (path: string = ""): string => {
  return `/auth/${path}`;
};

const AuthService = {
  postCode: async (body: { code: string }) =>
    await instance.post(authURL("code"), body),
  postOtp: async (body: { userId: string; sixDigit: string }) =>
    await instance.post(authURL("otp"), body),
  postActivate2fa: async (body: { userId: string; sixDigit: string }) =>
    await instance.post(authURL("activate2fa"), body),
  postDeactivate2fa: async () => await instance.post(authURL("deactivate2fa")),
  getQR: async () => await instance.get(authURL("qr")),
};

export default AuthService;
