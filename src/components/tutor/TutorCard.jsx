// src/components/TutorCard.jsx

import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

const TutorCard = ({ id, image, name, subjects, averageRating }) => {
  const navigate = useNavigate();

  const imageSrc = image
    ? `${BACKEND_URL}/api/images/view/${image}`
    : `${BACKEND_URL}/api/images/view/default-profile.png`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-border rounded-lg shadow-md p-4 w-60 flex flex-col h-full transition-colors duration-300">
      {/* Gambar */}
      <div className="w-full h-48 overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-lg font-semibold mt-5 text-textBase truncate">
        {name}
      </h2>

      {/* Subject Tags */}
      <div className="flex flex-wrap gap-1 mt-5 min-h-[48px]">
        {subjects.slice(0, 3).map((subject, idx) => (
          <span
            key={idx}
            className="text-xs bg-ctaSoft/15 text-cta px-2 py-1 rounded max-w-[80px] truncate"
          >
            {subject}
          </span>
        ))}

        {subjects.length > 3 && (
          <span className="text-xs bg-ctaSoft/15 text-cta px-2 py-1 rounded">
            +{subjects.length - 3} lainnya
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="text-sm mt-5 text-textMuted">
        ⭐ {`${averageRating}`}/5.0
      </div>

      {/* Action Button */}
      <button
        className="w-full bg-cta text-white py-1 rounded mt-5 hover:bg-ctaSoft transition-colors duration-200 font-semibold"
        onClick={() => navigate(`/tentor/${id}`)}
      >
        Lihat Tentor
      </button>
    </div>
  );
};

export default TutorCard;
