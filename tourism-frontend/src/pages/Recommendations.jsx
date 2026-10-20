import { useState } from "react";
import { Link } from "react-router-dom";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import { getRecommendations } from "../services/recommendationService";

const categories = [
    { name: "Nature", icon: "🌿" },
    { name: "Historical", icon: "🏛️" },
    { name: "Beach", icon: "🏖️" },
    { name: "Mountains", icon: "⛰️" },
    { name: "Wildlife", icon: "🐘" },
];

function Recommendations() {
    const [selectedCategories, setSelectedCategories] = useState(["Nature"]);
    const [budget, setBudget] = useState(25000);
    const [minRating, setMinRating] = useState(4);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    
    const toggleCategory = (category) => {
        setSelectedCategories((previous) =>
            previous.includes(category)
                ? previous.filter((item) => item !== category)
                : [...previous, category]
        );
    };

    
    const getMatchDetails = (destination) => {
        let score = 0;
        const reasons = [];

        const type = destination.type;
        const destinationBudget = Number(destination.budget);
        const rating = Number(destination.average_rating);

        
        if (selectedCategories.includes(type)) {
            score += 50;
            reasons.push(`Matches your interest in ${type}`);
        }

        
        if (destinationBudget <= budget) {
            score += 30;
            reasons.push("Within your selected budget");
        } else {
            reasons.push("Exceeds your selected budget");
        }

        
        if (rating >= minRating) {
            score += 20;
            reasons.push("Meets your minimum rating");
        } else {
            reasons.push("Below your preferred rating");
        }

        return { score, reasons };
    };

    
    const findRecommendations = async (event) => {
        event.preventDefault();

        if (selectedCategories.length === 0) {
            setError("Please select at least one interest.");
            return;
        }

        setLoading(true);
        setError("");
        setSearched(true);
        setRecommendations([]);

        try {
            const results = await getRecommendations({
                categories: selectedCategories,
                budget: Number(budget),
                minRating: Number(minRating),
            });

            setRecommendations(
                Array.isArray(results) ? results : []
            );
        } catch (err) {
            setError(
                err.message || "Failed to fetch recommendations."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <AfterLoginNavbar />

            
            <section className="px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#D5E3D5] bg-[#E8F0E8] px-4 py-2 text-sm font-medium text-emerald-900">
                        ✨ Your personalized travel guide
                    </span>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                        Find Your Perfect{" "}
                        <span className="text-emerald-800">
                            Destination
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                        Tell us what you love, choose your budget,
                        and discover destinations that match your
                        travel preferences.
                    </p>
                </div>
            </section>

            
            <section className="px-4 pb-12 sm:px-6">
                <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#D5E3D5] bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
                        <h2 className="text-xl font-bold text-gray-900">
                            Plan Your Next Adventure
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Customize your preferences below.
                        </p>
                    </div>

                    <form
                        onSubmit={findRecommendations}
                        className="space-y-8 p-5 sm:p-8"
                    >
                        
                        <div>
                            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                <label className="font-semibold text-gray-800">
                                    What interests you?
                                </label>

                                <span className="text-xs text-gray-500">
                                    Select one or more
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {categories.map((category) => {
                                    const selected =
                                        selectedCategories.includes(
                                            category.name
                                        );

                                    return (
                                        <button
                                            key={category.name}
                                            type="button"
                                            onClick={() =>
                                                toggleCategory(
                                                    category.name
                                                )
                                            }
                                            aria-pressed={selected}
                                            className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-4 text-sm font-medium transition duration-200 ${
                                                selected
                                                    ? "border-emerald-800 bg-emerald-800 text-white shadow-sm"
                                                    : "border-gray-200 bg-white text-gray-700 hover:border-emerald-600 hover:bg-emerald-50"
                                            }`}
                                        >
                                            <span className="text-xl">
                                                {category.icon}
                                            </span>

                                            {category.name}

                                            {selected && (
                                                <span>✓</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        
                        <div>
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="budget"
                                    className="font-semibold text-gray-800"
                                >
                                    Maximum budget
                                </label>

                                <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-900">
                                    ₹{budget.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <input
                                id="budget"
                                type="range"
                                min="1000"
                                max="50000"
                                step="500"
                                value={budget}
                                onChange={(event) =>
                                    setBudget(
                                        Number(event.target.value)
                                    )
                                }
                                className="w-full cursor-pointer accent-emerald-800"
                            />

                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>₹1,000</span>
                                <span>₹50,000</span>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                Compare destinations using their estimated
                                budgets.
                            </p>
                        </div>

                    
                        <div>
                            <label
                                htmlFor="rating"
                                className="mb-3 block font-semibold text-gray-800"
                            >
                                Minimum destination rating
                            </label>

                            <select
                                id="rating"
                                value={minRating}
                                onChange={(event) =>
                                    setMinRating(
                                        Number(event.target.value)
                                    )
                                }
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                            >
                                <option value={3}>
                                    3.0 and above
                                </option>
                                <option value={3.5}>
                                    3.5 and above
                                </option>
                                <option value={4}>
                                    4.0 and above
                                </option>
                                <option value={4.5}>
                                    4.5 and above
                                </option>
                                <option value={5}>
                                    5.0 only
                                </option>
                            </select>
                        </div>

                        
                        {error && (
                            <div
                                role="alert"
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                            >
                                {error}
                            </div>
                        )}

                    
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-4 font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Finding destinations...
                                </>
                            ) : (
                                <>✨ Find Recommendations</>
                            )}
                        </button>
                    </form>
                </div>
            </section>

        
            {loading && (
                <div className="px-4 pb-12 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-800" />

                    <p className="mt-4 text-sm text-gray-600">
                        Finding destinations for you...
                    </p>
                </div>
            )}

            
            {searched && !loading && !error && (
                <section className="px-4 pb-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-6xl">
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Your Recommendations
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                Discover destinations selected for your
                                travel preferences.
                            </p>

                            {recommendations.length > 0 && (
                                <p className="mt-2 text-sm font-medium text-emerald-800">
                                    {recommendations.length} destinations found
                                </p>
                            )}
                        </div>

                        {recommendations.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                                <div className="text-5xl">🧭</div>

                                <h3 className="mt-4 text-lg font-bold text-gray-800">
                                    No destinations found
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    Try selecting more interests, increasing
                                    your budget, or lowering your minimum
                                    rating.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {recommendations.map((destination) => {
                                    const {
                                        score,
                                        reasons,
                                    } = getMatchDetails(destination);

                                    const destinationId =
                                        destination.destination_id ??
                                        destination.id;

                                    return (
                                        <article
                                            key={destinationId}
                                            className="overflow-hidden rounded-2xl border border-[#D5E3D5] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            
                                            <div className="relative h-52 bg-gray-100">
                                                {destination.image_url ? (
                                                    <img
                                                        src={destination.image_url}
                                                        alt={destination.name}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-5xl">
                                                        🌍
                                                    </div>
                                                )}

                                                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm">
                                                    {destination.type}
                                                </span>

                                                <span className="absolute right-3 top-3 rounded-full bg-emerald-800 px-3 py-1.5 text-sm font-bold text-white shadow-sm">
                                                    {score}% Match
                                                </span>
                                            </div>

                                            
                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {destination.name}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-gray-500">
                                                            📍{" "}
                                                            {destination.location}
                                                        </p>
                                                    </div>

                                                    <span className="shrink-0 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm font-semibold text-amber-800">
                                                        ⭐{" "}
                                                        {Number(
                                                            destination.average_rating
                                                        ).toFixed(1)}
                                                    </span>
                                                </div>

                                                
                                                <div className="mt-5">
                                                    <div className="mb-2 flex items-center justify-between text-sm">
                                                        <span className="font-medium text-gray-600">
                                                            Preference match
                                                        </span>

                                                        <span className="font-bold text-emerald-800">
                                                            {score}%
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="h-2.5 overflow-hidden rounded-full bg-gray-100"
                                                        role="progressbar"
                                                        aria-valuenow={score}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        aria-label={`${score}% preference match`}
                                                    >
                                                        <div
                                                            className="h-full rounded-full bg-emerald-700 transition-all duration-500"
                                                            style={{
                                                                width: `${score}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            
                                                <div className="mt-5 rounded-xl bg-[#F5F8F4] p-4">
                                                    <h4 className="text-sm font-bold text-gray-800">
                                                        💡 Why this destination?
                                                    </h4>

                                                    <ul className="mt-3 space-y-2">
                                                        {reasons.map(
                                                            (reason, index) => {
                                                                const doesNotMatch =
                                                                    reason.startsWith(
                                                                        "Exceeds"
                                                                    ) ||
                                                                    reason.startsWith(
                                                                        "Below"
                                                                    );

                                                                return (
                                                                    <li
                                                                        key={index}
                                                                        className="flex items-start gap-2 text-sm leading-5 text-gray-600"
                                                                    >
                                                                        <span
                                                                            className={
                                                                                doesNotMatch
                                                                                    ? "font-bold text-amber-600"
                                                                                    : "font-bold text-emerald-700"
                                                                            }
                                                                        >
                                                                            {doesNotMatch
                                                                                ? "!"
                                                                                : "✓"}
                                                                        </span>

                                                                        <span>
                                                                            {reason}
                                                                        </span>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                                    </ul>
                                                </div>

                                        
                                                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Estimated budget
                                                        </p>

                                                        <p className="mt-1 text-lg font-bold text-gray-900">
                                                            ₹
                                                            {Number(
                                                                destination.budget
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>
                                                    </div>

                                                    <Link
                                                        to={`/destinations/${destinationId}`}
                                                        className="rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900"
                                                    >
                                                        View Details →
                                                    </Link>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Initial state */}
            {!searched && (
                <section className="px-4 pb-16 sm:px-6">
                    <div className="mx-auto max-w-3xl rounded-2xl border border-[#D5E3D5] bg-[#E8F0E8]/60 p-7 text-center sm:p-10">
                        <div className="text-5xl">🌄</div>

                        <h2 className="mt-4 text-xl font-bold text-emerald-950">
                            Your next adventure starts here
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
                            Choose your favourite travel experiences and
                            discover destinations that fit your budget.
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Recommendations;