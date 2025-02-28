import {
  FaBell,
  /* FaUserCircle, */ FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

function Header() {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-300">
      <div className=" max-w-7xl mx-auto sm:px-6 lg:px-8 flex items-center justify-between p-4 ">
        {/* 로고 */}
        <div className="flex items-center">
          {/* <h1 className="text-indigo-600 font-bold text-xl">TaskFlow</h1> */}
          <h1
            className="text-emerald-500 font-bold text-xl cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Plana
          </h1>
        </div>

        {/* 알림 아이콘 */}
        <div className="flex items-center space-x-4 mr-2">
          {/* 알림 아이콘 */}
          {/* <div className="relative">
            <FaBell className="h-6 w-6 text-gray-700" />
            <span className="absolute top-0 right-0 flex items-center justify-center w-3 h-3 bg-red-500 text-white text-xs rounded-full">
              3
            </span>
          </div> */}

          {/* 프로필 이미지 */}
          <div className="relative w-8 h-8">
            <div className="h-full flex items-center justify-center">
              {token ? (
                <FaSignOutAlt
                  className="text-red-500 cursor-pointer"
                  onClick={handleLogout}
                />
              ) : (
                <FaSignInAlt
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    navigate("/login");
                  }}
                />
              )}
            </div>
            {/* <FaUserCircle className="w-full h-full text-gray-300" /> */}
            {/* 로그인 시 표시 */}
            {/* <img
              src="../../assets/react.svg"
              alt="Profile"
              className="absolute inset-0 w-full h-full object-cover rounded-full"
            /> */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
