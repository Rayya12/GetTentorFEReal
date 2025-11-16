import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [passwordconfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { state } = useLocation(); // { role, token }
  const navigate = useNavigate();

  useEffect(() => {
    // Guard: kalau user masuk tanpa token/role dari OTP
    if (!state?.role || !state?.token) {
      setErrorMessage(
        "Data reset password tidak lengkap. Silakan ulangi proses lupa password."
      );
    }
  }, [state]);

  const handleGantiPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== passwordconfirm) {
      setErrorMessage("Password dan konfirmasi password tidak sama.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password harus lebih dari 6 karakter.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/forgotPassword${
          state?.role
        }/changePassword`,
        {
          password: password,
          repeatPassword: passwordconfirm,
          resetToken: state?.token,
        }
      );

      setSuccessMessage("Password berhasil diubah.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        "Gagal ubah password. Silakan coba lagi.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-login flex justify-center items-center px-4 text-textBase transition-colors duration-300">
      <div className="w-full max-w-6xl h-full bg-white dark:bg-slate-900 rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden border border-border">
        {/* Left Side */}
        <div className="hidden lg:block lg:w-1/2 h-auto bg-cta">
          <img
            src="/images/Frame 7.png"
            alt="Gambar GetTentor"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-8">
          <h1 className="text-4xl font-bold mb-4 text-textBase text-center">
            Buat Password Baru
          </h1>
          <h2 className="text-2xl font-semibold mb-6 text-textBase text-center">
            Masukkan password baru untuk akunmu
          </h2>

          <div className="w-full max-w-md space-y-6">
            {errorMessage && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 text-sm">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="w-full bg-green-100 border border-green-400 text-green-700 rounded-lg px-4 py-3 text-sm">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleGantiPassword} className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-textMuted"
                >
                  Password Baru
                </label>
                <input
                  id="password"
                  type="password"
                  className="mt-1 w-full px-4 py-2 border border-border rounded-xl bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="passwordconfirm"
                  className="mt-2 block text-sm font-medium text-textMuted"
                >
                  Konfirmasi Password
                </label>
                <input
                  id="passwordconfirm"
                  type="password"
                  className="mt-1 w-full px-4 py-2 border border-border rounded-xl bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                  value={passwordconfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="Ulangi password baru"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-cta hover:bg-ctaSoft text-white px-4 py-2 text-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-cta transition-colors duration-200"
              >
                Buat Password Baru
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
