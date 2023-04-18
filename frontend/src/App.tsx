import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "pages/login";
import NavBar from "components/common/NavBar";
import "styles/App.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<NavBar />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
