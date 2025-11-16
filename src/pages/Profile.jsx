// src/pages/Profile.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useUser } from "@/contexts/UserContextProvider";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;
const isValidFullName = (name) => /^[A-Za-zÀ-ÿ ']+$/.test(name.trim());
const isValidPhoneNumber = (number) => {
  // Format: 08xxxxxxxxxx, hanya angka, panjang 10-12 karakter
  return /^[0-9]{10,12}$/.test(number);
};

const isValidGPA = (gpa) => {
  // Hanya angka desimal dari 0.00 sampai 4.00, maksimal dua angka di belakang koma
  return /^([0-3](\.\d{1,2})?|4(\.0{1,2})?)$/.test(gpa);
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const role = user?.role;
  const isTentor = role === "tentor";

  const [isEditing, setIsEditing] = useState(false);
  const [initialEditForm, setInitialEditForm] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [selectedMataKuliahId, setSelectedMataKuliahId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [allMataKuliah, setAllMataKuliah] = useState([]);
  const [favoriteList, setFavoriteList] = useState([]);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const resUser = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const baseForm = {
          name: resUser.data.nama,
          email: resUser.data.email,
          noTelp: resUser.data.noTelp,
          fotoUrl: resUser.data.fotoUrl,
          fotoEdited: false,
          listMataKuliah: [""],
          pengalamanArray: [""],
          ipk: "",
        };

        if (role === "tentor") {
          const resTentor = await axios.get(
            `${BACKEND_URL}/api/tentors/${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          baseForm.listMataKuliah = resTentor.data.listMataKuliah || [""];
          baseForm.pengalamanArray = resTentor.data.pengalaman || [""];
          baseForm.ipk = resTentor.data.ipk || "";
        }

        setEditForm(baseForm);
        setInitialEditForm(baseForm);
      } catch (err) {
        alert("Gagal mengambil data user atau tentor");
        console.error(err);
      }
    };

    fetchUserData();

    if (user.role === "mentee") {
      axios
        .get(`${BACKEND_URL}/api/favorites/${user?.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setFavoriteList(response.data);
        })
        .catch((error) => {
          alert("Error ngambil favorit");
          console.error(error);
        });
    }
  }, [user, role]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/mata-kuliah`).then((response) => {
      setAllMataKuliah(response.data);
    });
  }, []);

  useEffect(() => {
    if (!isEditing) {
      setEditForm(initialEditForm);
      setErrorMessage("");
    }
  }, [isEditing, initialEditForm]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMataKuliahChange = (index, value) => {
    const newMataKuliah = [...editForm.listMataKuliah];
    newMataKuliah[index] = value;
    setEditForm((prev) => ({
      ...prev,
      listMataKuliah: newMataKuliah,
    }));
  };

  const handlePengalamanChange = (index, value) => {
    const newPengalaman = [...editForm.pengalamanArray];
    newPengalaman[index] = value;
    setEditForm((prev) => ({
      ...prev,
      pengalamanArray: newPengalaman,
    }));
  };

  const handleAddMataKuliah = () => {
    const mk = allMataKuliah.find((m) => m.id === selectedMataKuliahId);
    if (mk) {
      setEditForm((prev) => ({
        ...prev,
        listMataKuliah: [...prev.listMataKuliah, mk],
      }));
      setSelectedMataKuliahId("");
    }
  };

  const handleRemoveMataKuliah = (id) => {
    setEditForm((prev) => ({
      ...prev,
      listMataKuliah: prev.listMataKuliah.filter((mk) => mk.id !== id),
    }));
  };

  const handleAddPengalaman = () => {
    setEditForm((prev) => ({
      ...prev,
      pengalamanArray: [...prev.pengalamanArray, ""],
    }));
  };

  const handleRemovePengalaman = (index) => {
    const newPengalaman = [...editForm.pengalamanArray];
    newPengalaman.splice(index, 1);
    setEditForm((prev) => ({
      ...prev,
      pengalamanArray: newPengalaman,
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({
          ...prev,
          fileFoto: file,
          fotoUrl: reader.result,
          fotoEdited: true,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!isValidFullName(editForm.name)) {
      setErrorMessage("Nama lengkap hanya boleh berisi huruf dan spasi.");
      return;
    }

    if (!isValidPhoneNumber(editForm.noTelp)) {
      setErrorMessage(
        "Nomor telepon tidak valid. Gunakan 10-13 digit angka."
      );
      return;
    }

    if (user?.role === "tentor" && !isValidGPA(editForm.ipk)) {
      setErrorMessage(
        "IPK harus berupa angka antara 0.00 hingga 4.00 (gunakan titik sebagai pemisah desimal)."
      );
      return;
    }

    const formData = new FormData();
    if (editForm.fileFoto) {
      formData.append("file", editForm.fileFoto);
    }
    formData.append(
      "data",
      new Blob(
        [
          JSON.stringify({
            nama: editForm.name,
            noTelp: editForm.noTelp,
            ipk: editForm.ipk,
            pengalaman: editForm.pengalamanArray,
            listMataKuliah: editForm.listMataKuliah,
          }),
        ],
        { type: "application/json" }
      )
    );

    axios
      .put(`${BACKEND_URL}/api/${role}s/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Berhasil!!!");
        axios
          .get(`${BACKEND_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const userData = res.data;
            setUser((prev) => ({
              ...prev,
              name: userData.nama,
              fotoUrl: userData.fotoUrl || prev.fotoUrl,
            }));
            setIsEditing(false);
          })
          .catch((err) => {
            console.error("Gagal mengambil data user:", err);
          });
      })
      .catch((error) => {
        alert("Ada error waktu update profile!");
        console.error(error);
      });
  };

  if (!user || !editForm) {
    return (
      <div className="bg-bg min-h-screen text-textBase">
        <Header />
        <div className="max-w-4xl mx-auto py-10 px-4 text-center text-textMuted">
          Memuat profil...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg font-sans min-h-screen text-textBase transition-colors duration-300">
      <Header />
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {errorMessage && isEditing && (
            <div className="mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errorMessage}
            </div>
          )}

          {/* Foto + Tombol Edit */}
          <div className="relative flex items-start px-4 pt-4 pb-8 gap-6">
            <div className="relative">
              {isEditing ? (
                <div className="relative group">
                  <img
                    src={
                      editForm?.fotoEdited
                        ? editForm?.fotoUrl
                        : `${BACKEND_URL}/api/images/view/${
                            editForm?.fotoUrl || "default-profile.png"
                          }`
                    }
                    alt="Profile"
                    className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-bg shadow-lg z-10 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-center text-sm px-2">
                      Change Photo
                    </span>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <img
                  src={`${BACKEND_URL}/api/images/view/${
                    editForm?.fotoUrl || "default-profile.png"
                  }`}
                  alt="Profile"
                  className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-bg shadow-lg z-10 object-cover"
                />
              )}
            </div>

            <div className="flex flex-col gap-12 pt-16">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="border border-transparent bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 transition"
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 text-left px-4 pb-10">
          {isEditing ? (
            <>
              {/* EDIT MODE */}

              {/* Left Column - Editable Details */}
              <div className="border border-border rounded-xl p-6 shadow bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="mb-4">
                    <label className="font-medium text-textBase block mb-1">
                      Nama:
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-border rounded bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="font-medium text-textBase block mb-1">
                      Email:
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      className="w-full p-2 border border-border rounded bg-gray-100 dark:bg-slate-800 text-textMuted"
                      disabled
                    />
                  </div>

                  {/* IPK + HP */}
                  <div className="space-y-4">
                    {isTentor && (
                      <div>
                        <label className="font-medium text-textBase block mb-1">
                          IPK:
                        </label>
                        <input
                          type="text"
                          name="ipk"
                          value={editForm.ipk}
                          onChange={handleEditChange}
                          className="p-2 border border-border rounded w-24 bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                        />
                      </div>
                    )}

                    <div>
                      <label className="font-medium text-textBase block mb-1">
                        No. Telepon:
                      </label>
                      <input
                        type="tel"
                        name="noTelp"
                        value={editForm.noTelp}
                        onChange={handleEditChange}
                        className="p-2 border border-border rounded w-full bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Tentor extras / mentee filler */}
              {isTentor ? (
                <div className="space-y-6">
                  {/* Mata Kuliah Edit */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-border rounded-lg p-4 backdrop-blur-sm shadow">
                    <h3 className="text-2xl font-bold mb-3 text-textBase">
                      Mata Kuliah
                    </h3>
                    <div className="space-y-2">
                      {editForm.listMataKuliah.map((mk) => (
                        <div key={mk.id} className="flex items-center gap-2">
                          <span className="flex-1 p-2 border border-border rounded bg-bg text-textBase">
                            {mk.nama}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMataKuliah(mk.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Tambah Mata Kuliah */}
                    <div className="mt-3 flex gap-2 items-center">
                      <select
                        value={selectedMataKuliahId}
                        onChange={(e) =>
                          setSelectedMataKuliahId(Number(e.target.value))
                        }
                        className="flex-1 p-2 border border-border rounded bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                      >
                        <option value="">-- Pilih Mata Kuliah --</option>
                        {allMataKuliah
                          .filter(
                            (mk) =>
                              !editForm.listMataKuliah.some(
                                (dipilih) => dipilih.id === mk.id
                              )
                          )
                          .map((mk) => (
                            <option key={mk.id} value={mk.id}>
                              {mk.nama}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddMataKuliah}
                        disabled={!selectedMataKuliahId}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm disabled:opacity-50"
                      >
                        + Tambah
                      </button>
                    </div>
                  </div>

                  {/* Pengalaman Edit */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-border rounded-lg p-4 backdrop-blur-sm shadow">
                    <h3 className="text-2xl font-bold mb-3 text-textBase">
                      Pengalaman
                    </h3>
                    <div className="space-y-2">
                      {editForm.pengalamanArray.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              handlePengalamanChange(idx, e.target.value)
                            }
                            className="flex-1 p-2 border border-border rounded bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePengalaman(idx)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPengalaman}
                      className="mt-3 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      + Tambah Pengalaman
                    </button>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {/* Save Button */}
              <div className="flex justify-center mt-6 col-span-1 md:col-span-2">
                <button
                  onClick={handleSave}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold transition text-lg"
                >
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <>
              {/* VIEW MODE */}

              {/* Left Column - Profile Details */}
              <div className="border border-border rounded-xl p-6 shadow bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold mb-4 text-textBase">
                      {editForm?.name}
                    </h1>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-textBase">Email:</p>
                      <p className="text-lg mt-1 text-textMuted">
                        {editForm?.email}
                      </p>
                    </div>

                    {isTentor && (
                      <div>
                        <p className="font-semibold text-textBase">IPK:</p>
                        <p className="text-lg mt-1 text-textMuted">
                          {editForm?.ipk || "-"}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-textBase">
                        No. Telepon:
                      </p>
                      <p className="text-lg mt-1 text-textMuted">
                        {editForm?.noTelp || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              {isTentor ? (
                <div className="space-y-6">
                  {/* Courses */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-border rounded-lg p-4 backdrop-blur-sm shadow">
                    <h3 className="text-2xl font-bold mb-4 text-textBase">
                      Mata Kuliah
                    </h3>
                    {editForm?.listMataKuliah &&
                    editForm?.listMataKuliah.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {editForm?.listMataKuliah.map((mk, idx) => (
                          <span
                            key={idx}
                            className="bg-white/50 dark:bg-slate-800/70 backdrop-blur-sm border border-border px-4 py-2 rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-default text-textBase"
                          >
                            {mk.nama}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-textMuted italic">
                        Belum ada mata kuliah yang ditambahkan
                      </p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-border rounded-lg p-4 backdrop-blur-sm shadow">
                    <h3 className="text-2xl font-bold mb-4 text-textBase">
                      Pengalaman
                    </h3>
                    {editForm?.pengalamanArray.length > 0 ? (
                      <ul className="space-y-3 text-textMuted">
                        {editForm?.pengalamanArray.map((item, idx) => (
                          <li key={idx} className="text-lg">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-textMuted italic">
                        Belum ada pengalaman yang ditambahkan
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-border rounded-lg p-4 backdrop-blur-sm shadow">
                    <h3 className="text-2xl font-bold mb-4 text-textBase">
                      Hai Mentee!
                    </h3>
                    <p className="text-textMuted">
                      Kamu adalah seorang mentee. Kamu bisa mencari tentor
                      favoritmu dan melakukan pemesanan les.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-slate-900/80 border border-border rounded-lg p-4 backdrop-blur-sm shadow">
                    <h3 className="text-2xl font-bold mb-4 text-textBase">
                      Tentor Favorit
                    </h3>
                    <div className="text-textMuted">
                      {favoriteList.length > 0 ? (
                        <>
                          {favoriteList.slice(0, 3).map((item, idx) => (
                            <div key={idx}>
                              <p
                                className="bg-white/50 dark:bg-slate-800/70 backdrop-blur-sm border border-border px-4 py-2 rounded-lg shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer m-3 text-textBase"
                                onClick={() =>
                                  navigate(`/tentor/${item.id}`)
                                }
                              >
                                {item.nama}
                              </p>
                            </div>
                          ))}
                          {favoriteList.length > 3 && (
                            <div className="text-center">
                              <p>...</p>
                              <button
                                onClick={() => navigate("/profile/favorites")}
                                className="mt-2 text-cta hover:underline"
                              >
                                Lihat lebih
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        "Kamu belum memilih tentor favorit"
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
