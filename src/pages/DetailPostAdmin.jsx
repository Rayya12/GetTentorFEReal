import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tentor, setTentor] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${BACKEND_URL}/api/tentors/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const data = response.data;

        setTentor({
          name: data.nama,
          position: "Tentor @ GetTentor",
          experience: "",
          email: data.email,
          phone: data.noTelp,
          about: data.pengalaman || [],
          skills: data.listMataKuliah?.map((mk) => mk.nama) || [],
          profilePictureUrl: data.fotoUrl,
          ipk: data.ipk,
        });
      })
      .catch((error) => {
        alert("Error! Baca console pls");
        console.error(error);
      });
  }, [id]);

  return (
    <div className="bg-bg bg-cover bg-center font-sans min-h-screen text-textBase transition-colors duration-300">
      {/* Header Admin */}
      <header className="bg-header shadow-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/images/gettentor.png" alt="GetTentor" className="h-8" />
          </div>
          <div className="flex items-center p-2 gap-4">
            <div className="text-textBase font-semibold">Admin</div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div
            className="absolute top-0 left-1/2 w-screen bg-bg -translate-x-1/2"
            style={{ height: "63%" }}
          />
          <div className="relative flex items-center px-4 pt-4 pb-8 gap-6">
            {/* PROFILE IMAGE */}
            <div className="relative mt-4">
              <img
                src={`${BACKEND_URL}/api/images/view/${
                  tentor?.profilePictureUrl || "default-profile.png"
                }`}
                alt="Profile"
                className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-bg shadow-lg z-10 object-cover"
              />
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="flex flex-col justify-start gap-4 pt-4 md:pt-8">
              {/* NAMA */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-textBase">
                  {tentor?.name}
                </h1>
              </div>

              {/* SHORT DESCRIPTION */}
              <p className="text-sm text-textMuted italic text-left">
                {tentor?.position}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {/* LEFT CARD: detail kontak */}
          <div className="border border-border rounded-xl p-6 shadow bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <p className="text-base text-textMuted">{tentor?.experience}</p>
              </div>
              <div className="space-y-3 text-textBase">
                <p>
                  📧{" "}
                  <a
                    href={`mailto:${tentor?.email}`}
                    className="text-cta hover:underline"
                  >
                    {tentor?.email}
                  </a>
                </p>
                <p>📞 {tentor?.phone}</p>
                <p>IPK: {tentor?.ipk}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: skills + pengalaman */}
          <div className="space-y-6">
            {/* Skills */}
            <div className="flex items-center gap-4 flex-wrap">
              <img
                crossOrigin="anonymous"
                src="/images/book.png"
                alt="Skills"
                className="h-10 w-10"
              />
              {tentor?.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="cursor-default hover:scale-95 active:scale-90 bg-ctaSoft/15 text-cta px-3 py-1 rounded-full border border-ctaSoft/50 text-sm backdrop-blur-sm hover:bg-ctaSoft/25 hover:shadow-md transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Pengalaman list */}
            <div className="bg-white/80 dark:bg-slate-900/80 border border-border rounded-lg p-4 backdrop-blur-sm shadow relative">
              <h3 className="text-2xl font-bold mb-3 text-textBase">
                Pengalaman
              </h3>
              <div
                className={`text-textBase text-base leading-relaxed transition-all duration-300 ${
                  true
                    ? "max-h-[400px] overflow-y-auto"
                    : "max-h-[120px] overflow-hidden"
                }`}
              >
                <ul className="list-none pl-0 space-y-2 text-sm text-textBase m-2">
                  {tentor?.about?.map((point, idx) => (
                    <li
                      key={idx}
                      className="bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm border border-border px-4 py-2 rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-default"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {/* kalau nanti mau pakai expand, logicnya bisa balikin lagi */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
