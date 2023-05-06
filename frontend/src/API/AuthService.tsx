import instance from "API/api";

export const authURL = (path: string = ""): string => {
  return `/auth/${path}`;
};

const AuthService = {
  postCode: async (body: { code: string }) =>
    await instance.post(authURL("code"), body),
  postOtp: async (body: { userId: string; sixDigit: string }) =>
    await instance.post(authURL("otp"), body),
};

export default AuthService;
