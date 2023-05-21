import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "pages/login";
import Home from "pages/index";
import Redirect from "pages/Redirect";
import AppHeader from "components/common/AppHeader";
import "styles/global.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/redirect" element={<Redirect />} />
          <Route path="/*" element={<AppHeader />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
