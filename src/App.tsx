import {
  BrowserRouter,
  /* Navigate, */
  Route,
  Routes,
} from "react-router-dom";

// 라우팅
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Components
import Layout from "./components/layouts/Layout";

/* import supabase from "./utils/supabase";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore"; */

function App() {
  /*  const { token, setToken } = useAuthStore();

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setToken(data.session.access_token);
      }
    };
    getSession();
  }, [setToken]); */

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
