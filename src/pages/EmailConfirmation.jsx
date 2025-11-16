import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmailConfirmation() {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("mentee");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!userEmail.trim()) {
      setErrorMessage("Email tidak boleh kosong.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      setErrorMessage("Format email tidak valid.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/forgotPassword${role}/verifyMail/${userEmail}`
      );

      const message = `Email berhasil dikirim ke: ${userEmail}`;
      setSuccessMessage(message);

      navigate("/verification", { state: { role: role, email: userEmail } });
    } catch (error) {
      const message =
        error.response?.data ||
        error.message ||
        "Login gagal. Silakan coba lagi.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 text-textBase transition-colors duration-300">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row border border-border">
        {/* Kiri */}
        <div className="hidden lg:block lg:w-1/2 overflow-hidden h-auto bg-cta">
          <img
            src="/images/Frame 7.png"
            alt="Gambar GetTentor"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Kanan */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-textBase text-4xl font-bold text-center mb-4">
            Lupa Password
          </h1>
          <h2 className="text-textBase text-2xl font-semibold text-center mb-6">
            Masukkan email untuk verifikasi password
          </h2>

          {/* Tabs role */}
          <div className="flex justify-center space-x-8 border-b border-border mb-8">
            <div
              className={`cursor-pointer pb-2 text-lg font-semibold transition-colors duration-200 ${
                role === "mentee"
                  ? "text-textBase border-b-2 border-cta"
                  : "text-textMuted border-b-2 border-border"
              }`}
              onClick={() => !loading && setRole("mentee")}
            >
              Mentee
            </div>

            <div
              className={`cursor-pointer pb-2 text-lg font-semibold transition-colors duration-200 ${
                role === "tentor"
                  ? "text-textBase border-b-2 border-cta"
                  : "text-textMuted border-b-2 border-border"
              }`}
              onClick={() => !loading && setRole("tentor")}
            >
              Tentor
            </div>
          </div>

          <div className="space-y-6">
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
                className="block text-sm font-medium text-textMuted"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                disabled={loading}
                className={`mt-1 w-full px-4 py-2 border border-border rounded-lg bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 font-semibold rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-cta transition-colors duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cta hover:bg-ctaSoft"
              }`}
              onClick={handleVerify}
            >
              {loading ? "Mengirim..." : "Verifikasi Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
