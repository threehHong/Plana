import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// 컴포넌트
import Header from "./components/layouts/Header";

// 라우팅
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <BrowserRouter>
      {/* /login 또는 /register 경로가 아닌 경우에만 Header 렌더링 */}
      <ConditionalHeader />

      {/* 라우팅 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

function ConditionalHeader() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  return !isAuthPage && <Header />;
}

export default App;
