import { useState ,useEffect} from "react";
import { Link,useParams } from "react-router-dom";
import { getDestinations } from "../services/destinationService";
import { toast } from "react-toastify";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import {isBookmarked,addBookmark,removeBookmark} from "../services/bookmarkServices";



const categories = [
  "All",
  "Nature",
  "Historical",
  "Beach",
  "Mountains",
  "Wildlife",
];

function Destination() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxBudget, setMaxBudget] = useState(15000);
  const [sortBy, setSortBy] = useState("rating");
  const [destinations,setdestinations]=useState([])
  const [loading,setloading]=useState(true)

  

  //bookmark
 const [bookmarkIds, setBookmarkIds] = useState([]);
const [bookmarkLoading, setBookmarkLoading] = useState({});

useEffect(() => {
  const loadBookmarks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setBookmarkIds([]);
      return;
    }

    try {
      const results = await Promise.all(
        destinations.map(async (destination) => {
          const id = destination.destination_id;

          if (!id) return null;

          try {
            const bookmarked = await isBookmarked(id);
            return bookmarked ? Number(id) : null;
          } catch {
            return null;
          }
        })
      );

      setBookmarkIds(results.filter((id) => id !== null));
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    }
  };

  if (!loading) {
    loadBookmarks();
  }
}, [destinations, loading]);

const handleBookmark = async (destinationId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please log in to bookmark destinations");
    return;
  }

  const id = Number(destinationId);
  const alreadyBookmarked = bookmarkIds.includes(id);

  setBookmarkLoading((prev) => ({ ...prev, [id]: true }));

  try {
    if (alreadyBookmarked) {
      await removeBookmark(id);
      setBookmarkIds((prev) => prev.filter((item) => item !== id));
      toast.success("Bookmark removed");
    } else {
      await addBookmark(id);
      setBookmarkIds((prev) => [...prev, id]);
      toast.success("Added to bookmarks");
    }
  } catch (error) {
    toast.error(error.message || "Failed to update bookmark");
  } finally {
    setBookmarkLoading((prev) => ({ ...prev, [id]: false }));
  }
};

  useEffect(()=>{
    const fetchDestinatons=async()=>{
      try{
        const data=await getDestinations()
        setdestinations(data)
      }catch(err){
        toast.error(err.message)
      }
      finally{
        setloading(false)
      }
    }
    fetchDestinatons()
  },[])


  const filteredDestinations = destinations
    .filter((destination) => {
      const matchesSearch =
        destination.name.toLowerCase().includes(search.toLowerCase()) ||
        destination.location.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || destination.type === category;

      const matchesBudget = destination.budget <= maxBudget;

      return matchesSearch && matchesCategory && matchesBudget;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.average_rating - a.average_rating;
      }

      if (sortBy === "budget") {
        return a.budget - b.budget;
      }

      return a.name.localeCompare(b.name);
    });
    if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
            <p className="text-lg text-emerald-800">
                Loading destinations...
            </p>
        </div>
    );
}

if (destinations.length === 0) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
            <p className="text-gray-600">
                No destinations available.
            </p>
        </div>
    );
}

  return (
       <>
    <div className="min-h-screen bg-[#faf9f6]">
      <AfterLoginNavbar/>


      <section className="bg-[#E8F0E8] px-4 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-emerald-800 font-semibold tracking-widest text-sm uppercase">
            Find your next adventure
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3">
            Explore Destinations
          </h1>

          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
            Discover places that match your interests, explore new experiences,
            and plan your next unforgettable journey.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search destinations or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

      
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`px-4 py-2 rounded-full text-sm hover:cursor-pointer font-medium transition ${
                  category === item
                    ? "bg-emerald-800 text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 bg-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="rating">Highest Rated</option>
              <option value="budget">Lowest Budget</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>

      
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Popular Destinations
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {filteredDestinations.length} destinations found
          </p>
        </div>

        
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => (
              <article
                key={destination.destination_id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="relative">
                  <img
                    src={destination.image_url}
                    alt={destination.name}
                    loading="lazy"
                    className="w-full h-52 object-cover"
                  />
                   
                  <span className="absolute top-3 left-3 bg-white/95 text-emerald-900 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {destination.type}
                  </span>

                  <span className="absolute top-3 right-3 bg-white/95 px-3 py-1.5 rounded-full text-sm font-semibold">
                    ★ {destination.average_rating}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {destination.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mt-1 w-50">
                    📍 {destination.location}
                    
                  </p>
                  </div>
                  <button
  type="button"
  onClick={() => handleBookmark(destination.destination_id)}
  disabled={bookmarkLoading[destination.destination_id]}
  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
    bookmarkIds.includes(Number(destination.destination_id))
      ? "border border-emerald-800 bg-emerald-50 text-emerald-800"
      : "bg-emerald-800 text-white hover:bg-emerald-900"
  } disabled:cursor-not-allowed disabled:opacity-50`}
>
  {bookmarkLoading[destination.destination_id]
    ? "Updating..."
    : bookmarkIds.includes(Number(destination.destination_id))
    ? "♥️ Bookmarked"
    : "♡ Bookmark"}
</button>
              </div>

                  <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Estimated budget</p>
                      <p className="text-lg font-bold text-emerald-800">
                        ₹{destination.budget.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <Link
                      to={`/destinations/${destination.destination_id}`}
                      className="bg-emerald-800 text-white text-sm px-4 py-2.5 rounded-lg hover:bg-emerald-900 transition"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-4xl mb-4">🌍</p>

            <h3 className="text-xl font-semibold text-gray-900">
              No destinations found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setMaxBudget(15000);
              }}
              className="mt-5 bg-emerald-800 text-white px-5 py-2.5 rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      
      <footer className="bg-[#E8F0E8] border-t border-[#D5E3D5] mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} WanderWise. Discover your next adventure.
        </div>
      </footer>
    </div>
    </>
  );
}

export default Destination;