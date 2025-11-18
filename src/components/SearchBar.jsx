// src/components/SearchBar.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = input.trim();
    if (trimmed === "") {
      navigate("/");
    } else {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      {/* Input */}
      <input
        type="text"
        placeholder="Masukkan mata kuliah yang ingin dipelajari"
        className="
          w-[400px] px-4 py-2 
          border border-border 
          rounded-l-md 
          bg-bg text-textBase 
          shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-cta 
          transition-colors duration-200
        "
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      {/* Button */}
      <button
        className="
          bg-cta hover:bg-ctaSoft 
          text-white 
          px-4 py-2 
          rounded-r-md 
          font-semibold 
          transition-colors duration-200
        "
        onClick={handleSearch}
      >
        Cari 🔍
      </button>
    </div>
  );
};

export default SearchBar;
