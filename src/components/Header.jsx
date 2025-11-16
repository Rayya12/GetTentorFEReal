// src/components/Header.jsx
import { useUser } from "@/contexts/UserContextProvider";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const Header = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (user?.role === "tentor") {
      navigate("/profile");
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const avatarSrc = user?.fotoUrl
    ? `${BACKEND_URL}/api/images/view/${user.fotoUrl}`
    : `${BACKEND_URL}/api/images/view/default-profile.png`;

  return (
    <header className="bg-header text-textBase py-4 px-6 flex justify-between items-center shadow-md transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img
          src={`/images/gettentor.png`}
          alt="GetTentor Logo"
          className="w-64 h-12"
          onClick={handleLogoClick}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Tombol Tentor Favorit hanya untuk mentee */}
        {user?.role !== "tentor" && (
          <button
            onClick={() => navigate("/profile/favorites")}
            className="bg-cta hover:bg-ctaSoft text-white px-5 py-2 rounded-md font-semibold transition-colors duration-200"
          >
            Tentor Favorit
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
        >
          Logout
        </button>

        {/* User Info */}
        {user && (
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <span className="text-textBase">
              {user.name || user.nama || "User"}
            </span>
            <img
              src={avatarSrc}
              className="w-8 h-8 rounded-full border border-border object-cover"
              alt="User Avatar"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
