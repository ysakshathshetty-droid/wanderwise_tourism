import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import { getBookmarks, removeBookmark } from "../services/bookmarkService";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  function handleRemove(destinationId) {
    const updatedBookmarks = removeBookmark(destinationId);
    setBookmarks(updatedBookmarks);
  }

  return (
       <>
    <div className="min-h-screen bg-[#faf9f6]">
      <AfterLoginNavbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="mb-2 font-semibold uppercase tracking-widest text-emerald-800">
            Your Collection
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Bookmarks ♥️
          </h1>

          <p className="mt-3 text-gray-600">
            All the destinations you have saved for your future travels.
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="rounded-2xl border border-[#D5E3D5] bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-4 text-5xl">♡</div>

            <h2 className="text-xl font-semibold text-gray-800">
              No bookmarks yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              Explore destinations and bookmark the places you'd love to visit.
            </p>

            <Link
              to="/destinations"
              className="mt-6 inline-block rounded-xl bg-emerald-800 px-6 py-3 font-semibold text-white transition hover:bg-emerald-900"
            >
              Explore Destinations →
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-600">
              {bookmarks.length} saved destination
              {bookmarks.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((destination) => (
                <article
                  key={destination.destination_id}
                  className="overflow-hidden rounded-2xl border border-[#D5E3D5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg" >
                  <div className="relative">
                    <img
                      src={destination.image_url}
                      alt={destination.name}
                      className="h-52 w-full object-cover"
                    />

                    <button
                      onClick={() =>
                        handleRemove(destination.destination_id)
                      }
                      aria-label={`Remove ${destination.name} from bookmarks`}
                      title="Remove bookmark"
                      className="absolute right-3 top-3 rounded-full bg-white px-3 py-2 text-lg text-emerald-800 shadow-md transition hover:bg-red-50 hover:text-red-600"
                    >
                      ♥️
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold text-gray-900">
                        {destination.name}
                      </h2>

                      <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-800">
                        ⭐ {destination.average_rating}
                      </span>
                    </div>

                    <p className="mb-3 text-sm text-gray-500">
                      📍 {destination.location}
                    </p>

                    <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-600">
                      {destination.description}
                    </p>

                    <p className="mb-5 font-semibold text-emerald-800">
                      Approx. ₹{Number(destination.budget).toLocaleString("en-IN")}
                    </p>

                    <Link
                      to={`/destinations/${destination.destination_id}`}
                      className="block rounded-xl bg-emerald-800 py-3 text-center font-semibold text-white transition hover:bg-emerald-900"
                    >
                      View Details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
    </>
  );
}

export default Bookmarks;