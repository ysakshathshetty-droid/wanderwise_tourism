import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import {getBookmarks,removeBookmark,} from "../services/bookmarkServices";
import { getMyReviews } from "../services/dashboardService";
import { toast } from "react-toastify";

function Dashboard() {
 
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading,setReviewsLoading]=useState(true)

  
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const username = user?.name || user?.username || "Traveler";
  const email = user?.email || "Email not available";
  const role = user?.role || "User";


 const [bookmarks, setBookmarks] = useState([]); 
const [loadingBookmarks, setLoadingBookmarks] = useState(true);

useEffect(() => {
    const fetchBookmarks = async () => {
        try {
            const data = await getBookmarks();
            setBookmarks(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoadingBookmarks(false);
        }
    };

    fetchBookmarks();
}, []);

//reviews
  useEffect(() => {
    const fetchMyReviews = async () => {
        try {
            const data = await getMyReviews();
            setReviews(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setReviewsLoading(false);
        }
    };

    fetchMyReviews();
}, []);
  
 
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) => total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";


  const recentReviews = [...reviews].reverse().slice(0, 3);

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <AfterLoginNavbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        
        <section className="mb-8 overflow-hidden rounded-3xl bg-emerald-800 p-6 text-white sm:p-10 lg:p-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 sm:text-sm">
            Your Personal Dashboard
          </p>

          <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Welcome back, {username}! 👋
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-100 sm:text-base">
            Manage your travel activity, revisit your favourite places,
            and keep track of the reviews you have shared.
          </p>

          <Link
            to="/destination"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50 sm:text-base"
          >
            Explore Destinations <span>→</span>
          </Link>
        </section>

        
        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900 sm:text-2xl">
            Your Activity
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        
            <div className="rounded-2xl border border-[#D5E3D5] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Saved Destinations
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-emerald-800">
                    {bookmarks.length}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-800">
                  ♥️
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Destinations saved for later
              </p>
            </div>

          
            <div className="rounded-2xl border border-[#D5E3D5] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Reviews Written
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-emerald-800">
                    {reviews.length}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                  📝
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Reviews you have submitted
              </p>
            </div>

        
            <div className="rounded-2xl border border-[#D5E3D5] bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Your Average Rating
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-emerald-800">
                    {averageRating}
                    <span className="ml-1 text-lg text-amber-500">★</span>
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                  ⭐
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Average of your submitted ratings
              </p>
            </div>

          </div>
        </section>

        
        <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-5">

          
          <div className="rounded-2xl border border-[#D5E3D5] bg-white p-6 shadow-sm lg:col-span-2 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl">
                👤
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  User Information
                </h2>

                <p className="text-sm text-gray-500">
                  Your account details
                </p>
              </div>
            </div>

            <div className="space-y-5">

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 break-words font-medium text-gray-800">
                  {username}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 break-all font-medium text-gray-800">
                  {email}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account Role
                </p>

                <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold capitalize text-emerald-800">
                  {role}
                </span>
              </div>

            </div>

            <Link
              to="/profile"
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl border border-[#D5E3D5] px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
            >
              Edit Profile →
            </Link>
          </div>

        
          <div className="rounded-2xl border border-[#D5E3D5] bg-white p-6 shadow-sm lg:col-span-3 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Reviews
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Your latest contributions
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-800">
                {reviews.length} total
              </span>
            </div>

            {recentReviews.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-xl bg-[#faf9f6] px-5 py-8 text-center">
                <span className="mb-3 text-4xl">📝</span>

                <h3 className="font-semibold text-gray-800">
                  No reviews yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Share your experience by reviewing a destination you have
                  visited.
                </p>

                <Link
                  to="/destinations"
                  className="mt-4 font-semibold text-emerald-800 hover:underline"
                >
                  Explore Destinations →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review, index) => (
                  <div
                    key={review.review_id || index}
                    className="rounded-xl border border-gray-100 p-4 transition hover:bg-[#faf9f6]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-gray-900">
                          {review.destination_name ||
                            review.destinationName ||
                            "Destination Review"}
                        </h3>

                        {review.review_date && (
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(
                              review.review_date
                            ).toLocaleDateString("en-IN")}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 rounded-lg bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                        ⭐ {review.rating}/5
                      </span>
                    </div>

                    <p className="mt-3 break-words text-sm leading-6 text-gray-600">
                      {review.comment || "No written comment."}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

    
         <section className="mt-8 mb-6">
    <h2 className="mb-5 text-2xl font-bold text-emerald-900">
        My Bookmarks
    </h2>

    {loadingBookmarks ? (
        <p>Loading bookmarks...</p>
    ) : bookmarks.length === 0 ? (
        <p className="text-gray-600">
            You haven't bookmarked any destinations yet.
        </p>
    ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((destination) => (
                <div
                    key={destination.destination_id}
                    className="overflow-hidden rounded-xl border border-[#D5E3D5] bg-white shadow-sm"
                >
                    <img
                        src={destination.image_url}
                        alt={destination.name}
                        className="h-48 w-full object-cover"
                    />

                    <div className="p-5">
                        <h3 className="text-xl font-bold text-emerald-900">
                            {destination.name}
                        </h3>

                        <p className="mt-1 text-gray-600">
                            {destination.location}
                        </p>

                        <p className="mt-2 text-amber-600">
                            ⭐ {destination.average_rating}
                        </p>

                        <p className="mt-2 font-semibold">
                            ₹{Number(destination.budget).toLocaleString("en-IN")}
                        </p>

                        <Link
                            to={`/destinations/${destination.destination_id}`}
                            className="mt-4 inline-block text-emerald-800 font-semibold hover:underline"
                        >
                            View Details →
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    )}
</section>

        
        <section className="rounded-2xl border border-[#D5E3D5] bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Where would you like to go next?
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

            <Link
              to="/destination"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#D5E3D5] p-4 transition hover:bg-emerald-50"
            >
              <span className="font-medium text-gray-800">
                🗺️ Explore Destinations
              </span>

              <span className="text-emerald-800">→</span>
            </Link>

            <Link
              to="/recommendations"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#D5E3D5] p-4 transition hover:bg-emerald-50"
            >
              <span className="font-medium text-gray-800">
                ✨ Get Recommendations
              </span>

              <span className="text-emerald-800">→</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center justify-between gap-3 rounded-xl border border-[#D5E3D5] p-4 transition hover:bg-emerald-50"
            >
              <span className="font-medium text-gray-800">
                👤 Manage Profile
              </span>

              <span className="text-emerald-800">→</span>
            </Link>

          </div>
        </section>

      </main>

      <footer className="mt-12 border-t border-[#D5E3D5] bg-[#E8F0E8] px-4 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} WanderWise — Tourism Recommendation System
      </footer>
    </div>
  );
}

export default Dashboard;