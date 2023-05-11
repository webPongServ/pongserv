import io from "socket.io-client";
import { apiURL } from "API/api";

const token = localStorage.getItem("accessToken");

// export const socket = io(`${apiURL}?token=${token}`);
export const socket = io(apiURL, {
  extraHeaders: {
    Authorization: `Bearer ${token}`,
  },
});
