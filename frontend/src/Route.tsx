import Main from "pages/main";
import { Routes, Route } from "react-router-dom";

const MainRoute = (): JSX.Element => {
  return (
    <>
      <Routes>
        <Route path="/main" element={<Main />} />
        {/* <Route path="/party" element={<Party />} />
        <Route path="/party/:no" element={<PartyDetail />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </>
  );
};

export default MainRoute;
