import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AfterLoginNavbar from "../components/AfterLoginNavbar";

const API_URL = "http://localhost:5000/api";

// --------------------------------------------------
// FORMAT CURRENCY
// --------------------------------------------------

const formatPrice = (value) => {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "₹0";
    }

    return `₹${Math.round(number).toLocaleString("en-IN")}`;
};

// --------------------------------------------------
// CALCULATE INCLUSIVE DAYS
// --------------------------------------------------

const calculateDays = (departure, returning) => {

    if (!departure || !returning) return 0;

    const start = new Date(`${departure}T00:00:00`);
    const end = new Date(`${returning}T00:00:00`);

    const difference =
        Math.round((end - start) / (1000 * 60 * 60 * 24));

    return difference ;
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

function Recommendations() {

    const navigate = useNavigate();

    const today = new Date();

    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    const [region, setRegion] = useState("");

    const [departureDate, setDepartureDate] =
        useState(localToday);

    const [returnDate, setReturnDate] =
        useState("");

    const [minRating, setMinRating] =
        useState("3");

    const [travellers, setTravellers] =
        useState(1);

    const [recommendations, setRecommendations] =
        useState([]);

    const [itinerary, setItinerary] =
        useState([]);

    const [packageDetails, setPackageDetails] =
        useState(null);

    const [tripInfo, setTripInfo] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // --------------------------------------------------
    // CLEAR OLD RESULTS
    // --------------------------------------------------

    const clearResults = () => {

        setRecommendations([]);
        setItinerary([]);
        setPackageDetails(null);
        setTripInfo(null);
        setError("");
    };

    // --------------------------------------------------
    // HANDLE FORM SUBMISSION
    // --------------------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        clearResults();

        const trimmedRegion = region.trim();

        if (!trimmedRegion) {
            setError("Please enter a destination region or district.");
            return;
        }

        if (!departureDate || !returnDate) {
            setError("Please select both travel dates.");
            return;
        }

        if (returnDate < departureDate) {
            setError("Return date cannot be before departure date.");
            return;
        }

        if (Number(travellers) < 1) {
            setError("Please enter at least one traveller.");
            return;
        }

        const tripDays = calculateDays(
            departureDate,
            returnDate
        );

        if (tripDays > 30) {
            setError("Maximum trip duration is 30 days.");
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please log in to continue.");
            }

            const response = await fetch(
                `${API_URL}/recommendations`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        // Both names are sent for compatibility
                        region: trimmedRegion,
                        destination: trimmedRegion,

                        departureDate,
                        returnDate,

                        days: tripDays,

                        minRating: Number(minRating),

                        travellers: Number(travellers)

                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to fetch recommendations."
                );
            }

            // ------------------------------------------
            // VALIDATE BACKEND PACKAGE
            // ------------------------------------------

            const pkg = data.package;

            if (!pkg || typeof pkg !== "object") {
                throw new Error("Package details were not received from the server.");
            }

            const requiredFields = [
                "bengaluruTravelCost",
                "localTransportCost",
                "foodCost",
                "accommodationCost",
                "subtotal",
                "contingency",
                "total",
                "perPersonTotal"
            ];

            const invalidFields = requiredFields.filter(
                (field) =>
                    pkg[field] === null ||
                    pkg[field] === undefined ||
                    !Number.isFinite(Number(pkg[field]))
            );

            if (invalidFields.length > 0) {
                console.error("Invalid package received:", pkg);

                throw new Error(
                    `Invalid package fields: ${invalidFields.join(", ")}`
                );
            }

            // ------------------------------------------
            // SAVE RESULTS
            // ------------------------------------------

            setRecommendations(
                Array.isArray(data.recommendations)
                    ? data.recommendations
                    : []
            );

            setItinerary(
                Array.isArray(data.itinerary)
                    ? data.itinerary
                    : []
            );

            setPackageDetails(pkg);

            setTripInfo({
                destination: data.destination,
                startingLocation: data.startingLocation,
                departureDate: data.departureDate,
                returnDate: data.returnDate,
                days: data.days,
                nights: pkg.nights,
                travellers: data.travellers,
                totalAvailablePlaces: data.totalAvailablePlaces,
                selectedPlacesCount: data.selectedPlacesCount
            });

        } catch (err) {

            console.error("Recommendation error:", err);

            setError(err.message || "Something went wrong.");

        } finally {

            setLoading(false);

        }
    };

    // --------------------------------------------------
    // BOOK COMPLETE TRIP
    // --------------------------------------------------

    const handleBooking = () => {

        if (!packageDetails || !tripInfo) {
            setError("Please generate your recommendations first.");
            return;
        }

        navigate("/payment", {

            state: {

                destination: tripInfo.destination,

                startingLocation: "Bengaluru",

                departureDate: tripInfo.departureDate,

                returnDate: tripInfo.returnDate,

                days: tripInfo.days,

                nights: tripInfo.nights,

                travellers: tripInfo.travellers,

                minRating: Number(minRating),

                destinations: recommendations,

                itinerary,

                package: packageDetails,

                estimatedAmount: packageDetails.total

            }

        });
    };

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <div className="min-h-screen bg-slate-50">

            <AfterLoginNavbar />

            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* HEADER */}

                <div className="text-center mb-10">

                    <p className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                        WanderWise Travel Planner
                    </p>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mt-3">
                        Discover Your Next Journey
                    </h1>

                    <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                        Enter your preferred destination region and travel
                        dates. We will recommend nearby attractions and
                        calculate one complete trip package for you.
                    </p>

                </div>

                {/* FIXED STARTING POINT */}

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-7">

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center text-xl">
                            📍
                        </div>

                        <div>

                            <p className="text-sm text-blue-700 font-medium">
                                Your fixed starting and ending point
                            </p>

                            <h2 className="text-xl font-bold text-slate-800">
                                Bengaluru
                            </h2>

                        </div>

                    </div>

                    <p className="text-sm text-slate-600 mt-3">
                        Your journey will always start and end in Bengaluru.
                        Round-trip travel expenses are calculated once for
                        the entire package.
                    </p>

                </div>

                {/* FORM */}

                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-9 mb-10">

                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        Plan Your Journey
                    </h2>

                    <p className="text-slate-500 mb-7">
                        Enter your travel preferences below.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* REGION */}

                            <div className="md:col-span-2">

                                <label className="block font-semibold text-slate-700 mb-2">
                                    Destination Region / District
                                </label>

                                <input
                                    type="text"
                                    value={region}
                                    onChange={(e) => {
                                        setRegion(e.target.value);
                                        clearResults();
                                    }}
                                    placeholder="Example: Udupi, Kodagu, Mysuru, Chikkamagaluru"
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />

                                <p className="text-sm text-slate-400 mt-2">
                                    Enter a district or region. We will find
                                    matching tourist places from our database.
                                </p>

                            </div>

                            {/* DEPARTURE */}

                            <div>

                                <label className="block font-semibold text-slate-700 mb-2">
                                    Departure Date
                                </label>

                                <input
                                    type="date"
                                    min={localToday}
                                    value={departureDate}
                                    onChange={(e) => {
                                        setDepartureDate(e.target.value);
                                        clearResults();
                                    }}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>

                            {/* RETURN */}

                            <div>

                                <label className="block font-semibold text-slate-700 mb-2">
                                    Return Date
                                </label>

                                <input
                                    type="date"
                                    min={departureDate || localToday}
                                    value={returnDate}
                                    onChange={(e) => {
                                        setReturnDate(e.target.value);
                                        clearResults();
                                    }}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>

                            {/* RATING */}

                            <div>

                                <label className="block font-semibold text-slate-700 mb-2">
                                    Minimum Destination Rating
                                </label>

                                <select
                                    value={minRating}
                                    onChange={(e) => {
                                        setMinRating(e.target.value);
                                        clearResults();
                                    }}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="0">All Ratings</option>
                                    <option value="2">2.0 and above</option>
                                    <option value="3">3.0 and above</option>
                                    <option value="4">4.0 and above</option>
                                    <option value="4.5">4.5 and above</option>

                                </select>

                            </div>

                            {/* TRAVELLERS */}

                            <div>

                                <label className="block font-semibold text-slate-700 mb-2">
                                    Number of Travellers
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={travellers}
                                    onChange={(e) => {
                                        setTravellers(e.target.value);
                                        clearResults();
                                    }}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />

                            </div>

                        </div>

                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition duration-200 disabled:opacity-60"
                        >

                            {loading
                                ? "Finding Your Destinations..."
                                : "Explore Recommendations →"}

                        </button>

                    </form>

                    {/* ERROR */}

                    {error && (

                        <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                            {error}
                        </div>

                    )}

                </div>

                {/* RESULTS */}

                {packageDetails && tripInfo && (

                    <div className="space-y-8">

                        {/* TRIP SUMMARY */}

                        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">

                            <h2 className="text-2xl font-bold text-slate-800 mb-5">
                                Your Trip Summary
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                                <div className="bg-blue-50 p-5 rounded-2xl">
                                    <p className="text-sm text-slate-500">
                                        Destination
                                    </p>

                                    <h3 className="font-bold text-lg mt-1">
                                        {tripInfo.destination}
                                    </h3>
                                </div>

                                <div className="bg-indigo-50 p-5 rounded-2xl">
                                    <p className="text-sm text-slate-500">
                                        Total Days
                                    </p>

                                    <h3 className="font-bold text-lg mt-1">
                                        {tripInfo.days} Days
                                    </h3>
                                </div>

                                <div className="bg-green-50 p-5 rounded-2xl">
                                    <p className="text-sm text-slate-500">
                                        Travellers
                                    </p>

                                    <h3 className="font-bold text-lg mt-1">
                                        {tripInfo.travellers}
                                    </h3>
                                </div>

                                <div className="bg-orange-50 p-5 rounded-2xl">
                                    <p className="text-sm text-slate-500">
                                        Attractions Selected
                                    </p>

                                    <h3 className="font-bold text-lg mt-1">
                                        {tripInfo.selectedPlacesCount}
                                    </h3>
                                </div>

                            </div>

                        </div>

                        {/* RECOMMENDATIONS */}

                        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">

                            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                Recommended Destinations
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                {recommendations.map((place) => (

                                    <div
                                        key={place.destination_id}
                                        className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition"
                                    >

                                        {place.image_url && (

                                            <img
                                                src={place.image_url}
                                                alt={place.name}
                                                className="w-full h-48 object-cover"
                                            />

                                        )}

                                        <div className="p-5">

                                            <h3 className="font-bold text-lg text-slate-800">
                                                {place.name}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-1">
                                                📍 {place.location}
                                            </p>

                                            <p className="text-sm text-slate-500 mt-2">
                                                {place.type}
                                            </p>

                                            <p className="text-yellow-600 font-semibold mt-3">
                                                ★ {Number(place.average_rating || 0).toFixed(1)}
                                            </p>

                                            <p className="text-slate-600 text-sm mt-3">
                                                {place.description}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* ITINERARY */}

                        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8">

                            <h2 className="text-2xl font-bold text-slate-800 mb-6">
                                Your Day-wise Itinerary
                            </h2>

                            <div className="space-y-5">

                                {itinerary.map((day) => (

                                    <div
                                        key={day.day}
                                        className="border border-slate-200 rounded-2xl p-5"
                                    >

                                        <h3 className="text-xl font-bold text-blue-700 mb-4">
                                            Day {day.day}
                                        </h3>

                                        {day.places.length > 0 ? (

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                                {day.places.map((place) => (

                                                    <div
                                                        key={place.destination_id}
                                                        className="bg-slate-50 p-4 rounded-xl"
                                                    >

                                                        <h4 className="font-semibold text-slate-800">
                                                            {place.name}
                                                        </h4>

                                                        <p className="text-sm text-slate-500 mt-1">
                                                            {place.location}
                                                        </p>

                                                    </div>

                                                ))}

                                            </div>

                                        ) : (

                                            <p className="text-slate-500">
                                                {day.message}
                                            </p>

                                        )}

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* COMPLETE PACKAGE PRICE */}

                        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-9">

                            <h2 className="text-2xl font-bold text-slate-800">
                                Complete Trip Package
                            </h2>

                            <p className="text-slate-500 mt-2 mb-7">
                                Estimated expenses for your entire trip.
                            </p>

                            <div className="space-y-5">

                                <div className="flex justify-between gap-4 border-b pb-4">

                                    <span className="text-slate-600">
                                        Bengaluru Round-trip Travel
                                    </span>

                                    <span className="font-semibold">
                                        {formatPrice(packageDetails.bengaluruTravelCost)}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4 border-b pb-4">

                                    <span className="text-slate-600">
                                        Local Transportation
                                    </span>

                                    <span className="font-semibold">
                                        {formatPrice(packageDetails.localTransportCost)}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4 border-b pb-4">

                                    <span className="text-slate-600">
                                        Food
                                    </span>

                                    <span className="font-semibold">
                                        {formatPrice(packageDetails.foodCost)}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4 border-b pb-4">

                                    <span className="text-slate-600">
                                        Accommodation ({packageDetails.nights} nights)
                                    </span>

                                    <span className="font-semibold">
                                        {formatPrice(packageDetails.accommodationCost)}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4 border-b pb-4">

                                    <span className="text-slate-600">
                                        Contingency (5%)
                                    </span>

                                    <span className="font-semibold">
                                        {formatPrice(packageDetails.contingency)}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4 border-b pb-4">

                                    <span className="text-slate-600">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold">
                                        {formatPrice(packageDetails.subtotal)}
                                    </span>

                                </div>

                            </div>

                            {/* TOTAL */}

                            <div className="bg-blue-50 rounded-2xl p-6 mt-7">

                                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

                                    <div>

                                        <h3 className="text-lg font-bold text-slate-800">
                                            Total Package Price
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-2">
                                            Price per person:{" "}
                                            {formatPrice(packageDetails.perPersonTotal)}
                                        </p>

                                    </div>

                                    <h2 className="text-3xl font-bold text-blue-700">
                                        {formatPrice(packageDetails.total)}
                                    </h2>

                                </div>

                            </div>

                            <p className="text-sm text-slate-500 mt-5">
                                Travel distance and package costs are estimates.
                                Actual expenses may vary depending on routes,
                                transportation, accommodation and food choices.
                            </p>

                            {/* BOOKING BUTTON */}

                            <button
                                onClick={handleBooking}
                                className="w-full mt-7 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition duration-200"
                            >
                                Book This Complete Trip
                            </button>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Recommendations;