import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@/contexts/UserContextProvider';

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function TutorProfile() {
  const { id } = useParams();
  const [tentor, setTentor] = useState(null);

  const handleLogout = () => {
    // Hapus token dari localStorage atau cookie
    localStorage.removeItem("token");

    // Arahkan ke halaman login atau landing page
    navigate("/admin/login");
  };

  useEffect(() => {
    if (!id) return;
  
    axios.get(`${BACKEND_URL}/api/tentors/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(response => {
      const data = response.data;
  
      setTentor({
        name: data.nama,
        position: "Tentor @ getTentor",
        experience: "",
        email: data.email,
        phone: data.noTelp,
        about: data.pengalaman,
        skills: data.listMataKuliah.map(mk => mk.nama),
        profilePictureUrl: data.fotoUrl,
        ipk: data.ipk
      });
    })
    .catch(error => {
      alert('Error! Baca console pls');
      console.error(error);
    });
  
    });

  
  
  // const maxLength = 2;
  // const canExpand = tentor?.about?.length > maxLength;
  // const displayText = isExpanded ? tentor?.about : `${tentor?.about.substring(0, maxLength)}${canExpand ? "..." : ""}`;

  

  return (
    <div className="bg-white bg-cover bg-center font-sans">
      {/* Header */}
      <header className="bg-[#a7d8f0]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/images/gettentor.png" alt="GetTentor" className="h-8" />
          </div>
          <div className="flex items-center p-2">
            <div className="text-slate-800 font-semibold mr-4">Admin</div>
          <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Logout
        </button>
          </div>
          
        </div>
      </header>
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute top-0 left-1/2 w-screen bg-white-100 -translate-x-1/2" style={{ height: '63%' }} />
          <div className="relative flex items-center px-4 pt-4 pb-8 gap-6">
            {/* PROFILE IMAGE */}
            <div className="relative mt-4">
              <img
                src={`${BACKEND_URL}/api/images/view/${tentor?.profilePictureUrl || 'default-profile.png'}`}
                alt="Profile"
                className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-white shadow-lg z-10 object-cover"
              />
            </div>

            {/* RIGHT SIDE CONTENT */}
            <div className="flex flex-col justify-start gap-4 pt-4 md:pt-8">
              {/* NAMA + RATING */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {tentor?.name}
                </h1>
                {/* <p className="border bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition text-sm">
                  ★
                </p> */}
              </div>

              {/* SHORT DESCRIPTION */}
              <p className="text-sm text-gray-600 italic text-left">
                {tentor?.position}
              </p>

            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          <div className="border rounded-xl p-6 shadow bg-white/50 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                {/* <h1 className="text-2xl font-bold">{tentor?.name}</h1>
                <p className="text-blue-600 hover:underline text-base">{tentor?.position}</p> */}
                <p className="text-base text-gray-500">{tentor?.experience}</p>
              </div>
              <div className="space-y-3">
                <p>📧<a href={`mailto:${tentor?.email}`} className="text-blue-600 underline">
                   {tentor?.email}
                </a></p>
                <p>📞 {tentor?.phone}</p>
                <p>IPK: {tentor?.ipk}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <img crossOrigin="anonymous" src="/images/book.png" alt="Skills" className="h-10 w-10"/>
              {tentor?.skills.map((skill, index) => (
                <span
                  key={index}
                  className="
                  cursor-pointer hover:scale-95 active:scale-90
                  bg-white/50 text-blue-800 px-3 py-1 rounded-full border border-blue-200 text-sm backdrop-blur-sm hover:bg-white/70 hover:shadow-md transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="bg-white/50 border rounded-lg p-4 backdrop-blur-sm shadow relative">
              <h3 className="text-2xl font-bold mb-3">Pengalaman</h3>
              <div className={`text-gray-700 text-base leading-relaxed transition-all duration-300 ${
                true ? 'max-h-[400px] overflow-y-auto' : 'max-h-[120px] overflow-hidden'
              }`}>
                <ul className="list-none pl-0 space-y-2 text-sm text-gray-700 m-2">
                  {tentor?.about.map((point, idx) => (
                    <li
                      key={idx}
                      className="bg-white/50 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-lg shadow-sm
                                hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              {/* {canExpand && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2 absolute bottom-2 right-4 bg-white/80 px-3 py-1 rounded-full">
                  {isExpanded ? (
                    <><span className="hidden md:inline">Show Less</span><span className="md:hidden">▲</span></>
                  ) : (
                    <><span className="hidden md:inline">Read More</span><span className="md:hidden">▼</span></>
                  )}
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}