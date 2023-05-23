import axios from "axios";

export const apiURL: string = process.env.REACT_APP_API_URL!;

const instance = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login?error=auth_failed";
    } else if (error.response.status === 404) {
      // 백엔드에서 404 에러를 띄워주고, page not found HTML 까지 응답으로 보내주는 방법이 있음
      alert("존재하지 않는 페이지입니다.");
      window.location.href = "/";
    } else {
      alert(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default instance;
