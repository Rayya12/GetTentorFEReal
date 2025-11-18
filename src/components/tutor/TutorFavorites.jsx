import { useState, useEffect } from "react";
import TutorCard from "./TutorCard";
import axios from "axios";
import { useUser } from "@/contexts/UserContextProvider";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const TutorFavorites = () => {
  const { user } = useUser();
  const [tentors, setTentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${BACKEND_URL}/api/favorites/${user.id}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        setTentors(response.data || []);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          "Terjadi kesalahan saat mengambil tentor favorit. Silakan coba lagi."
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchTutors();
    }
  }, [user]);

  // User belum siap dari context
  if (!user) {
    return (
      <div className="text-center py-10 text-textMuted">
        Memuat data pengguna...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10 text-textMuted">
        Mengambil tentor favorit...
      </div>
    );
  }

  return (
    <section className="mt-8 px-8">
      <div className="m-4">
        <h2 className="text-xl font-semibold text-white bg-cta rounded-md px-6 py-1">
          Tentor Favorit {user?.name}
        </h2>
      </div>

      {errorMessage && (
        <p className="text-center text-red-600 mb-4">{errorMessage}</p>
      )}

      <div className="flex flex-wrap gap-6 justify-center items-center">
        {tentors.length > 0 ? (
          tentors.map((tentor, idx) => (
            <TutorCard
              key={tentor.id ?? idx}
              id={tentor.id}
              image={tentor.fotoUrl}
              name={tentor.nama}
              subjects={tentor.listMataKuliah?.map((mk) => mk.nama) ?? []}
              averageRating={
                typeof tentor.averageRating === "number"
                  ? tentor.averageRating.toFixed(1)
                  : "0.0"
              }
            />
          ))
        ) : (
          <div className="text-textMuted text-lg">
            Belum ada tentor favorit
          </div>
        )}
      </div>
    </section>
  );
};

export default TutorFavorites;
