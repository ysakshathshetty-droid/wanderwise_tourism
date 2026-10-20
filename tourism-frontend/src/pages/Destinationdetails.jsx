import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import {isBookmarked,addBookmark,removeBookmark,} from "../services/bookmarkServices"
import { getReviews,addReview } from "../services/reviewService";
import { getDestinationById, } from "../services/destinationService";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api/destinations";

function DestinationDetails() {
  const { id } = useParams();
  const [bookmarked, setBookmarked] = useState(false);

  const [reviews,setReviews]=useState([])
  const [reviewsLoading,setReviewsLoading]=useState(true)
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  const token = localStorage.getItem("token");


  //Book mark
useEffect(() => {
    const checkBookmark = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setBookmarked(false);
            return;
        }

        try {
            const status = await isBookmarked(id);
            setBookmarked(status);
        } catch (error) {
            toast.error(error.message);
        }
    };

    checkBookmark();
}, [id]);

const handleBookmark = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        toast.error("Please log in to bookmark destinations");
        return;
    }

    try {
        if (bookmarked) {
            await removeBookmark(id);

            setBookmarked(false);
            toast.success("Bookmark removed");
        } else {
            await addBookmark(id);

            setBookmarked(true);
            toast.success("Added to bookmarks");
        }
    } catch (error) {
        toast.error(error.message);
    }
};

//review

useEffect(() => {
    const fetchReviews = async () => {
        try {
            const data = await getReviews(id);
            setReviews(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setReviewsLoading(false);
        }
    };

    fetchReviews();
}, [id]);

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const controller = new AbortController();

    async function fetchDestination() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load destination");
        }

        setDestination(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDestination();

    return () => controller.abort();
  }, [id]);

  //handle reviewsubmit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
        toast.error("Please enter your review");
        return;
    }

    setSubmitting(true);
    setReviewMessage("");

    try {
        await addReview({
            destination_id: Number(id),
            rating,
            comment: comment.trim()
        });

        const updatedReviews = await getReviews(id);
        setReviews(updatedReviews);

        const updatedDestination=await getDestinationById(id)
        setDestination(updatedDestination)

        setComment("");
        setRating(5);

        setReviewMessage("Your review was submitted successfully!");
        toast.success("Review submitted successfully!");

    } catch (error) {
        toast.error(error.message);
    } finally {
        setSubmitting(false);
    }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <AfterLoginNavbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-emerald-800 text-lg font-medium">
            Loading destination...
          </p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <AfterLoginNavbar />

        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Destination unavailable
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "The requested destination could not be found."}
          </p>

          <Link
            to="/destination"
            className="inline-block mt-6 bg-emerald-800 text-white px-5 py-3 rounded-lg hover:bg-emerald-900"
          >
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
       <>
    <div className="min-h-screen bg-[#faf9f6]">
      <AfterLoginNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
        <div className="flex justify-between">
        <Link
          to="/destination"
          className="inline-flex items-center gap-2 text-emerald-800 hover:text-emerald-950 font-medium mb-6"
        >
          ← Back to Destinations
        </Link>
        <button
  onClick={handleBookmark}
  className={`rounded-xl px-5 py-3 font-semibold hover:cursor-pointer mb-3 transition ${
    bookmarked
      ? "border border-emerald-800 bg-emerald-50 text-emerald-800"
      : "bg-emerald-800 text-white hover:bg-emerald-900"
  }`}
>
  {bookmarked ? "♥️ Bookmarked" : "♡ Add to Bookmarks"}
</button>
</div>
        
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-64 sm:h-80 lg:h-[430px] object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 lg:p-10">
            <span className="inline-block bg-white/95 text-emerald-900 text-sm font-semibold px-3 py-1.5 rounded-full mb-3">
              {destination.type}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {destination.name}
            </h1>

            <p className="text-white/90 mt-2 text-sm sm:text-base">
              📍 {destination.location}
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <section className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">
                About This Destination
              </h2>

              <p className="text-gray-600 leading-7 mt-4 whitespace-pre-line">
                {destination.description ||
                  "More information about this destination will be available soon."}
              </p>
            </div>

            
<div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-900">
            Ratings & Reviews
        </h2>

        <div>
            <p className="text-xl font-bold text-emerald-800">
                ⭐ {Number(destination.average_rating || 0).toFixed(1)} / 5
            </p>

            <p className="text-sm text-gray-500">
                {reviews.length} reviews
            </p>
        </div>
    </div>

    <div className="mt-6 space-y-5">
        {reviewsLoading ? (
            <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length > 0 ? (
            reviews.map((review) => (
                <article
                    key={review.review_id}
                    className="border-t border-gray-100 pt-5"
                >
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">
                            {review.user_name}
                        </h3>

                        <span className="text-amber-500">
                            {"★".repeat(Number(review.rating))}
                            <span className="text-gray-300">
                                {"★".repeat(5 - Number(review.rating))}
                            </span>
                        </span>
                    </div>

                    <p className="mt-2 leading-6 text-gray-600">
                        {review.comment}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                        {new Date(review.review_date).toLocaleDateString()}
                    </p>
                </article>
            ))
        ) : (
            <p className="border-t border-gray-100 pt-5 text-gray-500">
                No reviews yet. Be the first to share your experience!
            </p>
        )}
    </div>
</div>

            
            <div className="mt-6 bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm">
    <h2 className="text-2xl font-bold text-gray-900">
        Write a Review
    </h2>

    {token ? (
        <form onSubmit={handleReviewSubmit} className="mt-5 space-y-5">
            <div>
                <label
                    htmlFor="rating"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Your Rating
                </label>

                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full sm:w-48 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                >
                    <option value={5}>★★★★★ - Excellent</option>
                    <option value={4}>★★★★ - Very Good</option>
                    <option value={3}>★★★ - Good</option>
                    <option value={2}>★★ - Fair</option>
                    <option value={1}>★ - Poor</option>
                </select>
            </div>

            <div>
                <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Your Review
                </label>

                <textarea
                    id="comment"
                    rows={4}
                    maxLength={1000}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    required
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                    {comment.length}/1000
                </p>
            </div>

            <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="w-full sm:w-auto bg-emerald-800 text-white px-6 py-3 rounded-lg hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    ) : (
        <p className="mt-4 text-gray-600">
            Please{" "}
            <Link
                to="/login"
                className="text-emerald-800 font-semibold underline"
            >
                log in
            </Link>{" "}
            to submit a rating and review.
        </p>
    )}

    {reviewMessage && (
        <p role="status" className="mt-4 text-sm text-emerald-800">
            {reviewMessage}
        </p>
    )}
</div>
          </section>

          
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-gray-900">
                Travel Information
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💰</span>

                  <div>
                    <p className="text-sm text-gray-500">Estimated Budget</p>
                    <p className="text-xl font-bold text-emerald-800">
                      ₹
                      {Number(destination.budget || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>

                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">
                      {destination.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏷️</span>

                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">
                      {destination.type}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/destination"
                className="block text-center mt-7 w-full bg-emerald-800 text-white py-3 rounded-lg hover:bg-emerald-900 transition"
              >
                Explore More Destinations
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-[#E8F0E8] border-t border-[#D5E3D5] mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} WanderWise. Discover your next adventure.
        </div>
      </footer>
    </div>
    </>
  );
}

export default DestinationDetails;