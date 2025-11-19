import { useState } from "react";
import axios from "axios";
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
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/${role}s/login`,
        {
          email: userEmail,
          password: userPassword,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      setSuccessMessage("Login berhasil!");
      setErrorMessage("");

      setTimeout(() => {
        navigate(role === "tentor" ? "/profile" : "/");
      },0);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Login gagal. Silakan coba lagi.";
      setErrorMessage(message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-login flex items-center justify-center px-4 transition-colors duration-300">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row transition-colors duration-300">
        {/* Left Image */}
        <div className="hidden lg:block lg:w-1/2 overflow-hidden bg-cta">
          <img
            src={`/images/Frame 7.png`}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-center text-textBase mb-3">
            Selamat Datang
          </h1>
          <h2 className="text-2xl font-semibold text-center text-textMuted mb-6">
            Silahkan Login ke Akun Anda!
          </h2>

          {/* Role Tabs */}
          <div className="flex justify-center space-x-8 border-b border-border mb-8">
            <button
              type="button"
              className={`cursor-pointer pb-2 text-lg font-semibold transition-colors ${
                role === "mentee"
                  ? "text-textBase border-b-2 border-cta"
                  : "text-textMuted border-b-2 border-transparent"
              }`}
              onClick={() => setRole("mentee")}
            >
              Mentee
            </button>

            <button
              type="button"
              className={`cursor-pointer pb-2 text-lg font-semibold transition-colors ${
                role === "tentor"
                  ? "text-textBase border-b-2 border-cta"
                  : "text-textMuted border-b-2 border-transparent"
              }`}
              onClick={() => setRole("tentor")}
            >
              Tentor
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
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

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-textBase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2 rounded-lg border border-border bg-bg text-textBase 
                           focus:outline-none focus:ring-2 focus:ring-cta transition"
                onChange={(e) => setUserEmail(e.target.value)}
                value={userEmail}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-textBase"
              >
                Kata Sandi
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 rounded-lg border border-border bg-bg text-textBase 
                           focus:outline-none focus:ring-2 focus:ring-cta transition"
                onChange={(e) => setUserPassword(e.target.value)}
                value={userPassword}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-cta hover:bg-ctaSoft 
                         transition shadow-md focus:outline-none focus:ring-2 focus:ring-cta"
            >
              Masuk sebagai {role === "mentee" ? "Mentee" : "Tentor"}
            </button>

            {/* Links */}
            <div className="text-center text-textMuted">
              <span>Belum punya akun? </span>
              <a href="./register" className="text-cta hover:underline font-semibold">
                Daftar!
              </a>
            </div>

            <div className="text-center text-textMuted">
              <span>Lupa Password? </span>
              <a href="./forget" className="text-cta hover:underline font-semibold">
                Klik disini!
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
