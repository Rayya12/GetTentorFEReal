import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

const statusStyle = (status) => {
  switch ((status || "").toLowerCase()) {
    case "approved":
      return "bg-green-500 text-white";
    case "rejected":
      return "bg-red-500 text-white";
    case "suspend":
    case "suspended":
      return "bg-rose-500 text-white";
    case "pending":
    default:
      return "bg-yellow-400 text-gray-900";
  }
};

export default function ListTentor() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // ← pakai setter
  const q = searchParams.get("q") || "";
  const [input, setInput] = useState(q); // ← sinkron input dengan q

  const [tentors, setTentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const handleLogout = () => {
    // Hapus token dari localStorage atau cookie
    localStorage.removeItem("token");

    // Arahkan ke halaman login atau landing page
    navigate("/admin/login");
  };

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed === "") {
      setSearchParams({});
      navigate("/admin/dashboard"); 
    } else {
      setSearchParams({ q: trimmed });
      navigate(`/admin/dashboard?q=${encodeURIComponent(trimmed)}`);
    }
  };


  useEffect(() => {
    setInput(q);
  }, [q]);

 
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setErrMsg("");

        if (!q) {
          const res = await axios.get(`${BACKEND_URL}/api/admins`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
          if (!active) return;
          setTentors(
            list.map((t) => ({
              id: t.id ?? t.tentorId ?? t.mahasiswaId,
              name:
                t.nama ??
                t.name ??
                t.mahasiswa?.nama ??
                t.user?.fullName ??
                "Tanpa Nama",
              ipk: t.ipk ?? t.mahasiswa?.ipk ?? 0,
              status:
                t.verification_status ??
                t.verificationStatus ??
                t.status ??
                "PENDING",
            }))
          );
        } else {
          const res = await axios.get(
            `${BACKEND_URL}/api/admins?q=${encodeURIComponent(q)}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
          if (!active) return;
          setTentors(
            list.map((t) => ({
              id: t.id ?? t.tentorId ?? t.mahasiswaId,
              name:
                t.nama ??
                t.name ??
                t.mahasiswa?.nama ??
                t.user?.fullName ??
                "Tanpa Nama",
              ipk: t.ipk ?? t.mahasiswa?.ipk ?? 0,
              status:
                t.verification_status ??
                t.verificationStatus ??
                t.status ??
                "PENDING",
            }))
          );
        }
      } catch (e) {
        console.error(e);
        setErrMsg(
          e?.response?.data?.message || "Gagal memuat data tentor. Coba lagi."
        );
      } finally {
        active && setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [q]); 


  const handleChangeStatus = async (id, newStatus) => {
    const prev = tentors;
    setTentors((s) =>
      s.map((x) => (x.id === id ? { ...x, status: newStatus } : x))
    );
    try {
      await axios.post(
        `${BACKEND_URL}/api/tentors/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (e) {
      console.error(e);
      setErrMsg(
        e?.response?.data?.message || "Gagal mengubah status verifikasi."
      );
      setTentors(prev); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus tentor dengan ini secara permanen?")) return;
    const prev = tentors;
    setTentors((s) => s.filter((x) => x.id !== id));
    try {
      await axios.delete(`${BACKEND_URL}/api/tentors/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (e) {
      console.error(e);
      setErrMsg(e?.response?.data?.message || "Gagal menghapus tentor.");
      setTentors(prev);
    }
  };


  const goDetail = (id) => navigate(`/admin/tentor/${id}`);

  return (
    <div className="min-h-screen bg-[#f6fbff]">
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

      {/* Search Bar */}
      <div className="flex justify-center mt-6">
        <input
          type="text"
          placeholder="Masukkan Kata Kunci yang ingin dicari"
          className="w-[400px] px-4 py-2 border rounded-l-md shadow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
        />
        <button
          className="bg-blue hover:bg-blue-dark text-white px-4 py-2 rounded-r-md"
          onClick={handleSearch}
        >
          Cari 🔍
        </button>
      </div>

      {/* Body */}
      <main className="mx-auto w-full max-w-4xl px-6 py-8">
        <h2 className="text-3xl font-semibold mb-4 text-blue">
          {q ? `Hasil Pencarian untuk "${q}"` : "List Tentor"}
        </h2>

        {errMsg && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700">
            {errMsg}
          </div>
        )}

        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-600">
            Memuat data…
          </div>
        ) : tentors.length === 0 ? (
          <div className="text-slate-600">Belum ada data tentor.</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {tentors.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
              >
                {/* Left: info */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="min-w-[220px] font-semibold text-slate-900">
                    {t.name}
                  </div>
                  <div className="text-slate-600">
                    <span className="font-medium">IPK:</span>{" "}
                    {Number(t.ipk || 0).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600">Status Verifikasi:</span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusStyle(
                        t.status
                      )}`}
                    >
                      {t.status}
                    </span>

                    {/* dropdown ubah status */}
                    <select
                      className="ml-2 rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
                      value={t.status || "PENDING"}
                      onChange={(e) => handleChangeStatus(t.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => goDetail(t.id)}
                    className="rounded-xl bg-[#1f6fbf] px-4 py-2 text-sm font-semibold text-white hover:brightness-110 active:brightness-95"
                  >
                    Lihat detail
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="rounded-xl p-2 text-rose-600 hover:bg-rose-50 active:bg-rose-100"
                    title="Hapus"
                    aria-label="Hapus tentor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="currentColor"
                    >
                      <path d="M9 3h6a1 1 0 011 1v1h4a1 1 0 110 2h-1.08l-1.09 12.02A3 3 0 0114.84 22H9.16a3 3 0 01-2.99-2.98L5.08 7H4a1 1 0 110-2h4V4a1 1 0 011-1zm2 0v1h2V3h-2zM7.08 7l1.01 11.13A1 1 0 009.08 19h5.84a1 1 0 00.99-.87L17.92 7H7.08zM10 9a1 1 0 012 0v8a1 1 0 11-2 0V9zm4 0a1 1 0 112 0v8a1 1 0 11-2 0V9z" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
