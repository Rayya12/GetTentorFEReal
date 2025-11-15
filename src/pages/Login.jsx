import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [role, setRole] = useState("mentee");

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/api/${role}s/login`, {
        email: userEmail,
        password: userPassword
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      setSuccessMessage("Login berhasil!");
      setTimeout(() => {
        navigate(role === "tentor" ? "/profile" : "/");
      }, 2000);
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Login gagal. Silakan coba lagi.";
      setErrorMessage(message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Image */}
        <div className="hidden lg:block lg:w-1/2 overflow-hidden rounded-l-4xl h-auto">
          <img
            src={`/images/Frame 7.png`}
            alt="Login Illustration"
            className="bg-blue w-full h-full object-cover"
            style={{ minHeight: "100%" }}
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Selamat Datang
          </h1>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Silahkan Login ke Akun Anda !
          </h2>

          {/* Role Tabs */}
          <div className="flex justify-center space-x-8 border-b mb-8">
            <div
              className={`cursor-pointer pb-2 text-lg font-semibold   ${
                role === "mentee"
                  ? "text-black border-b-2 border-blue"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
              onClick={() => setRole("mentee")}
            >
              Mentee
            </div>
            <div
              className={`cursor-pointer pb-2 text-lg font-semibold transition-colors duration-200 ${
                role === "tentor"
                  ? "text-black border-b-2 border-blue"
                  : "text-gray-500 border-b-2 border-gray-300"
              }`}
              onClick={() => setRole("tentor")}
            >
              Tentor
            </div>
          </div>

          <form className="space-y-6">
            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {successMessage}
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUserPassword(e.target.value)}
                value={userPassword}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 text-white bg-blue hover:bg-blue-dark rounded-lg font-semibold shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleLogin}
            >
              {`Masuk sebagai ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>

            <div className="text-m text-center text-gray-600">
              <span>Belum punya akun? </span>
              <a href="./register" className=" text-blue-dark hover:underline">
                Daftar!
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
