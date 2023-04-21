import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "pages/login";
import AppHeader from "components/common/AppHeader";
import "styles/global.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppHeader />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
