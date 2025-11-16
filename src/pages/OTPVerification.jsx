import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { state } = useLocation(); // { role, email }
  const navigate = useNavigate();

  useEffect(() => {
    // Kalau user masuk tanpa state, balikin ke lupa password
    if (!state?.role || !state?.email) {
      setErrorMessage("Data verifikasi tidak lengkap. Silakan ulangi proses lupa password.");
      optional: navigate("/forget");
    }
  }, [state]);

  const handleVerifikasi = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!otp || otp.length !== 6) {
      setErrorMessage("OTP harus terdiri dari 6 digit angka.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/forgotPassword${state?.role}/verifyOTP`,
        {
          email: state?.email,
          otp: Number(otp),
        }
      );

      const token = response.data.resetToken;
      setSuccessMessage("Otentikasi berhasil");

      setTimeout(() => {
        navigate("/changePassword", {
          state: {
            role: state?.role,
            token: token,
          },
        });
      }, 1500);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "OTP gagal. Silakan coba lagi.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-login flex justify-center items-center px-4 text-textBase transition-colors duration-300">
      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden border border-border">
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
          <h1 className="text-4xl font-bold mb-4 text-textBase">
            Verifikasi OTP
          </h1>
          <h2 className="text-2xl font-semibold mb-6 text-textBase text-center">
            Masukkan OTP yang telah dikirim ke email
            {state?.email ? (
              <span className="block text-sm text-textMuted mt-1">
                ({state.email})
              </span>
            ) : null}
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

            <form onSubmit={handleVerifikasi} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-textMuted"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  className="mt-1 w-full px-4 py-2 border border-border rounded-xl bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d{0,6}$/.test(val)) {
                      setOtp(val);
                    }
                  }}
                  maxLength={6}
                  placeholder="Masukkan 6 digit"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-cta hover:bg-ctaSoft text-white px-4 py-2 text-center font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-cta transition-colors duration-200"
              >
                Verifikasi OTP
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
