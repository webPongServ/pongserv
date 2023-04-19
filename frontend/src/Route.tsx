import { Routes, Route } from "react-router-dom";
import Main from "pages/main";
import Profile from "pages/Profile";

const MainRoute = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/main" element={<Main />} />
        <Route path="/profile/:no" element={<Profile />} />
        {/* <Route path="/party" element={<Party />} />
        /* <Route path="/mypage" element={<Mypage />} />
        <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </>
  );
};

export default MainRoute;
