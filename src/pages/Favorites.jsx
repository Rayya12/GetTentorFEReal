import Header from "@/components/Header";
import TutorFavorites from "@/components/tutor/TutorFavorites";
import { useUser } from "@/contexts/UserContextProvider";

export default function Favorites() {
  const { user } = useUser();

  return (
    <div className="bg-bg min-h-screen text-textBase transition-colors duration-300">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-cta mt-10 mb-8">
          Tentor Favorit {user?.name || "Mentee"}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <TutorFavorites />
      </div>
    </div>
  );
}
