import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import axios from "axios";
import { useUser } from "@/contexts/UserContextProvider";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export default function TutorProfile() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [tentor, setTentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false); // kalau nanti mau dipakai lagi
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [visibleReviews, setVisibleReviews] = useState(1);
  const reviewsPerLoad = 2;

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Detail tentor
    axios
      .get(`${BACKEND_URL}/api/tentors/${id}`, { headers })
      .then((response) => {
        const data = response.data;

        setTentor({
          name: data.nama,
          position: "Tentor @ GetTentor",
          experience: "",
          rating: `${data.averageRating.toFixed(1)} (${data.ratingCount} Reviews)`,
          location: "Jakarta - Kelapa Gading",
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

    // Reviews
    axios
      .get(`${BACKEND_URL}/api/reviews/tentor/${id}`, { headers })
      .then((response) => {
        const transformedReviews = response.data.map((review) => ({
          id: review.id,
          userId: review.mentee.id,
          name: review.reviewerNama,
          avatar: review.mentee.fotoUrl || `default-profile.png`,
          date: new Date(review.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          rating: review.rating,
          comment: review.komentar,
        }));

        setReviews(transformedReviews);

        const hasReviewed = user
          ? transformedReviews.some(
              (review) => review.userId === parseInt(user?.id)
            )
          : false;

        if (hasReviewed) {
          setAlreadyReviewed(true);
        }
      })
      .catch((error) => {
        alert("Error ambil review!");
        console.error(error);
      });

    // Favorite (untuk mentee yang login)
    if (user) {
      axios
        .get(`${BACKEND_URL}/api/favorites/${user?.id}`, { headers })
        .then((response) => {
          setIsFavorited(
            response.data.some((fav) => fav.id === parseInt(id, 10))
          );
        })
        .catch((error) => {
          alert("Error ambil favorit!");
          console.error(error);
        });
    }
  }, [id, refresh, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    axios
      .post(
        `${BACKEND_URL}/api/reviews`,
        {
          menteeId: user?.id,
          tentorId: id,
          rating: newReview.rating,
          komentar: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        setNewReview({ rating: 5, comment: "" });
        setAlreadyReviewed(true);
        setRefresh((prev) => !prev);
      })
      .catch((error) => {
        alert("Error! Baca console coba");
        console.error(error);
      });
  };

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + reviewsPerLoad);
  };

  const toggleAllReviews = () => {
    if (showAllReviews) {
      setVisibleReviews(1);
    } else {
      setVisibleReviews(reviews.length);
    }
    setShowAllReviews((prev) => !prev);
  };

  const handleFavoriteClick = () => {
    if (!user) {
      alert("Silakan login sebagai mentee terlebih dahulu.");
      return;
    }

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    if (!isFavorited) {
      axios
        .post(
          `${BACKEND_URL}/api/favorites`,
          null,
          {
            params: {
              tentorId: id,
              menteeId: user.id,
            },
            headers,
          }
        )
        .then(() => {
          setIsFavorited(true);
        })
        .catch((error) => {
          alert("Error tambah favorit!");
          console.error(error);
        });
    } else {
      axios
        .delete(`${BACKEND_URL}/api/favorites`, {
          params: {
            tentorId: id,
            menteeId: user.id,
          },
          headers,
        })
        .then(() => {
          setIsFavorited(false);
        })
        .catch((error) => {
          alert("Error hapus favorit!");
          console.error(error);
        });
    }
  };

  const displayedReviews = showAllReviews
    ? reviews
    : reviews.slice(0, visibleReviews);

  return (
    <div className="bg-bg bg-cover bg-center font-sans min-h-screen text-textBase transition-colors duration-300">
      <Header />

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
              {/* NAMA + RATING */}
              <div className="flex items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-textBase">
                  {tentor?.name}
                </h1>
              </div>

              {/* SHORT DESCRIPTION */}
              <p className="text-sm text-textMuted italic text-left">
                {tentor?.position}
              </p>

              {/* FAVORITE BUTTON */}
              <button
                className={`border px-4 py-2 rounded-full font-semibold transition backdrop-blur-sm w-fit ${
                  isFavorited
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-white/70 dark:bg-slate-800 hover:bg-white/90 dark:hover:bg-slate-700 text-textBase"
                }`}
                onClick={handleFavoriteClick}
              >
                {isFavorited ? "❤️ Favorited" : "🤍 Add to Fav"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {/* Left card: info */}
          <div className="border border-border rounded-xl p-6 shadow bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <p className="text-base text-textMuted">{tentor?.experience}</p>
              </div>
              <div className="space-y-3 text-textBase">
                <p>⭐ {tentor?.rating}</p>
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

          {/* Right: skills + pengalaman */}
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
                  className="cursor-pointer hover:scale-95 active:scale-90 bg-ctaSoft/15 text-cta px-3 py-1 rounded-full border border-ctaSoft/50 text-sm backdrop-blur-sm hover:bg-ctaSoft/25 hover:shadow-md transition-all duration-200"
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
            </div>
          </div>
        </div>

        {/* Reviews section */}
        <section className="mt-10 text-left bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-border rounded px-4 py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-textBase">
              What mentees say...
            </h2>
            {reviews.length > 1 && (
              <button
                onClick={toggleAllReviews}
                className="text-sm text-cta hover:underline"
              >
                {showAllReviews ? "Hide Reviews" : "Show All Reviews"}
              </button>
            )}
          </div>

          {/* Form review */}
          {!alreadyReviewed ? (
            <>
              <button
                className="w-full px-4 py-2 border border-border rounded-full hover:bg-bg transition bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm mb-6 text-textBase"
                onClick={() => {
                  setShowReviewForm(!showReviewForm);
                }}
              >
                {showReviewForm ? "Cancel Review" : "Add Your Review"}
              </button>

              {showReviewForm && (
                <form
                  onSubmit={handleSubmitReview}
                  className="mb-8 p-4 border border-border rounded-lg bg-white/80 dark:bg-slate-900/80"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-textBase">
                      Rating
                    </label>
                    <div className="flex items-center">
                      <select
                        name="rating"
                        value={newReview.rating}
                        onChange={handleInputChange}
                        className="p-2 border border-border rounded mr-2 bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num} Star{num !== 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <span className="text-yellow-500 text-xl">
                        {renderStars(newReview.rating)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-textBase">
                      Your Review
                    </label>
                    <textarea
                      name="comment"
                      value={newReview.comment}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-border rounded h-24 bg-bg text-textBase focus:outline-none focus:ring-2 focus:ring-cta"
                      placeholder="Share your experience with this tentor?..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-cta hover:bg-ctaSoft text-white rounded-full font-semibold transition-colors duration-200"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </>
          ) : (
            <p className="text-sm text-textMuted italic mb-4">
              Heee~ yang udah bikin review nggak bisa bikin lagi ya~
            </p>
          )}

          {/* List review */}
          {displayedReviews.length > 0 ? (
            displayedReviews.map((review) => (
              <div key={review.id} className="mb-8 p-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={`${BACKEND_URL}/api/images/view/${review.avatar}`}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-textBase">
                      {review.name}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-2">
                        {renderStars(review.rating)}
                      </span>
                      <span className="text-xs text-textMuted">
                        • {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-textBase text-sm text-left">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-textMuted text-center py-4">
              No reviews yet. Be the first to review!
            </p>
          )}

          {!showAllReviews && visibleReviews < reviews.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={loadMoreReviews}
                className="px-4 py-2 border border-border rounded-full hover:bg-bg transition bg-white/70 dark:bg-slate-800/80 backdrop-blur-sm text-textBase"
              >
                Load More ({reviews.length - visibleReviews} remaining)
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
