import { useState, useEffect } from 'react';
import TutorCard from './TutorCard';
import axios from 'axios';
import { useSearchParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const TutorList = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const [tentors, setTentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        let response;
        const token = localStorage.getItem("token");

        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        if (!q) {
          response = await axios.get(
            `${BACKEND_URL}/api/tentors`,
            { headers }
          );
        } else {
          response = await axios.get(
            `${BACKEND_URL}/api/tentors/search?q=${encodeURIComponent(q)}`,
            { headers }
          );
        }

        setTentors(response.data || []);
      } catch (error) {
        console.error(error);
        setErrorMessage("Terjadi kesalahan saat memuat data tentor. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [q]);

  return (
    <section className="mt-8 px-8">
      <h2 className="text-3xl font-semibold mb-4 text-cta">
        {q ? `Hasil Pencarian untuk "${q}"` : 'Daftar Tentor Tersedia'}
      </h2>

      {errorMessage && (
        <p className="text-center text-red-600 mb-4">
          {errorMessage}
        </p>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-border border-t-cta"></div>
        </div>
      )}

      {!loading && !errorMessage && tentors.length === 0 && (
        <p className="text-center text-textMuted">
          Tidak ada tentor yang ditemukan.
        </p>
      )}

      {!loading && !errorMessage && tentors.length > 0 && (
        <div className="flex flex-wrap gap-6 justify-center items-stretch">
          {tentors.map((tentor, idx) => (
            <TutorCard
              key={tentor.id ?? idx}
              id={tentor.id}
              image={tentor.fotoUrl}
              name={tentor.nama}
              subjects={tentor.listMataKuliah?.map(mk => mk.nama) ?? []}
              averageRating={
                typeof tentor.averageRating === "number"
                  ? tentor.averageRating.toFixed(1)
                  : "0.0"
              }
              countFavorite = {tentor.countFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TutorList;
