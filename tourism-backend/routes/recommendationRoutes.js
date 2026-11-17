// const express = require("express");
// const pool = require("../config/db");
// const verifyToken = require("../middleware/authMiddleware");

// const router = express.Router();

// // GET RECOMMENDATIONS
// router.post("/", verifyToken, async (req, res) => {
//     try {
//         const { categories, budget:maxBudget, minRating } = req.body;

//         if (
//             !Array.isArray(categories) ||
//             categories.length === 0 ||
//             maxBudget === undefined ||
//             minRating === undefined
//         ) {
//             return res.status(400).json({
//                 message: "Please provide categories, budget, and minimum rating"
//             });
//         }

//         const budget = Number(maxBudget);
//         const rating = Number(minRating);

//         if (
//             !Number.isFinite(budget) ||
//             budget < 0 ||
//             !Number.isFinite(rating) ||
//             rating < 0 ||
//             rating > 5 ||
//             categories.some(
//                 category => typeof category !== "string" || !category.trim()
//             )
//         ) {
//             return res.status(400).json({
//                 message: "Invalid recommendation preferences"
//             });
//         }

//         const placeholders = categories.map(() => "?").join(", ");

//         const sql = `
//             SELECT
//                 destination_id,
//                 name,
//                 location,
//                 type,
//                 average_rating,
//                 budget,
//                 description,
//                 image_url
//             FROM destinations
//             WHERE type IN (${placeholders})
//               AND budget <= ?
//               AND average_rating >= ?
//             ORDER BY average_rating DESC, budget ASC
//         `;

//         const [destinations] = await pool.execute(sql, [
//             ...categories,
//             budget,
//             rating
//         ]);

//         res.status(200).json({
//             count: destinations.length,
//             recommendations: destinations
//         });

//     } catch (error) {
//         console.error("Recommendation error:", error);

//         res.status(500).json({
//             message: "Failed to fetch recommendations"
//         });
//     }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();

const db = require("../config/db");
const verifyToken = require("../middleware/authMiddleware");

const {
    STARTING_LOCATION,
    BENGALURU,
    PRICING,
    validNumber,
    calculateDistance,
    hasCoordinates,
    calculateRegionCentre,
    calculatePackagePrice
} = require("../utils/packagePricing");



// HELPER: GROUP NEARBY DESTINATIONS INTO DAYS
// --------------------------------------------------

function createItinerary(places, days) {

    const remaining = [...places];

    const itinerary = [];

    for (let day = 1; day <= days; day++) {

        if (remaining.length === 0) {
            itinerary.push({
                day,
                places: [],
                message: "Free time or leisure activities."
            });

            continue;
        }

        // Choose the highest-rated remaining place
        let seedIndex = 0;

        for (let i = 1; i < remaining.length; i++) {

            if (
                validNumber(remaining[i].average_rating) >
                validNumber(remaining[seedIndex].average_rating)
            ) {
                seedIndex = i;
            }
        }

        const dayPlaces = [];

        const seed = remaining.splice(seedIndex, 1)[0];

        dayPlaces.push(seed);

        // Add nearby places to the same day
        while (
            dayPlaces.length < PRICING.maxPlacesPerDay &&
            remaining.length > 0
        ) {

            const lastPlace = dayPlaces[dayPlaces.length - 1];

            if (!hasCoordinates(lastPlace)) {
                break;
            }

            let nearestIndex = -1;
            let nearestDistance = Infinity;

            remaining.forEach((place, index) => {

                if (!hasCoordinates(place)) {
                    return;
                }

                const distance = calculateDistance(
                    Number(lastPlace.latitude),
                    Number(lastPlace.longitude),
                    Number(place.latitude),
                    Number(place.longitude)
                );

                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIndex = index;
                }
            });

            // Do not combine distant attractions in one day
            if (
                nearestIndex === -1 ||
                nearestDistance > PRICING.nearbyDistanceKm
            ) {
                break;
            }

            dayPlaces.push(
                remaining.splice(nearestIndex, 1)[0]
            );
        }

        itinerary.push({
            day,
            places: dayPlaces,
            message: dayPlaces.length === 0
                ? "Free time or leisure activities."
                : null
        });
    }

    return itinerary;
}

// --------------------------------------------------
// HELPER: CALCULATE COMPLETE PACKAGE PRICE
// --------------------------------------------------



// --------------------------------------------------
// POST /api/recommendations
// --------------------------------------------------

router.post("/", verifyToken, async (req, res) => {

    try {

        // Accept either region or destination from frontend
        const region = String(
            req.body.region || req.body.destination || ""
        ).trim();

        const departureDate = req.body.departureDate;
        const returnDate = req.body.returnDate;

        const minRating = validNumber(req.body.minRating, 3);

        const travellers = Number(req.body.travellers);

        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!region || region.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid destination region."
            });
        }

        if (!departureDate || !returnDate) {
            return res.status(400).json({
                success: false,
                message: "Please select departure and return dates."
            });
        }

        if (
            !Number.isInteger(travellers) ||
            travellers < 1 ||
            travellers > 20
        ) {
            return res.status(400).json({
                success: false,
                message: "Number of travellers must be between 1 and 20."
            });
        }

        if (minRating < 0 || minRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 0 and 5."
            });
        }

        // ------------------------------------------
        // CALCULATE TRIP DAYS
        // ------------------------------------------

        const start = new Date(`${departureDate}T00:00:00`);
        const end = new Date(`${returnDate}T00:00:00`);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime()) ||
            end < start
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid departure or return date."
            });
        }

        const days =
            Math.round((end - start) / (1000 * 60 * 60 * 24)) ;

        if (days > 30) {
            return res.status(400).json({
                success: false,
                message: "Trips longer than 30 days are not supported."
            });
        }

        // ------------------------------------------
        // FETCH DESTINATIONS FROM MYSQL
        // ------------------------------------------

        const sql = `
            SELECT
                destination_id,
                name,
                location,
                type,
                average_rating,
                budget,
                description,
                image_url,
                latitude,
                longitude
            FROM destinations
            WHERE LOWER(location) LIKE LOWER(?)
              AND COALESCE(average_rating, 0) >= ?
            ORDER BY average_rating DESC
        `;

        const [places] = await db.query(sql, [
            `%${region}%`,
            minRating
        ]);

        if (!places || places.length === 0) {

            return res.status(404).json({
                success: false,
                message: `No destinations found for ${region}. Try another district or region.`
            });
        }

        // ------------------------------------------
        // CALCULATE REGION CENTRE
        // ------------------------------------------

        const centre = calculateRegionCentre(places);

        if (!centre) {
            return res.status(400).json({
                success: false,
                message: "Destination coordinates are missing. Please add latitude and longitude to the destination records."
            });
        }

        // ------------------------------------------
        // DISTANCE FROM BENGALURU
        // ------------------------------------------

        const straightLineDistance = calculateDistance(
            BENGALURU.latitude,
            BENGALURU.longitude,
            centre.latitude,
            centre.longitude
        );

        // ------------------------------------------
        // SELECT PLACES AND CREATE ITINERARY
        // ------------------------------------------

        const maxPlaces = days * PRICING.maxPlacesPerDay;

        // Prefer higher-rated destinations.
        // The itinerary groups geographically close places.
        const selectedPlaces = places.slice(0, maxPlaces);

        const itinerary = createItinerary(
            selectedPlaces,
            days
        );

        // ------------------------------------------
        // CALCULATE COMPLETE PACKAGE
        // ------------------------------------------

        const packageDetails = calculatePackagePrice(
            straightLineDistance,
            days,
            travellers
        );

        // ------------------------------------------
        // CHECK PACKAGE NUMBERS BEFORE RESPONSE
        // ------------------------------------------

        const priceFields = [
            "bengaluruTravelCost",
            "localTransportCost",
            "foodCost",
            "accommodationCost",
            "subtotal",
            "contingency",
            "total",
            "perPersonTotal"
        ];

        for (const field of priceFields) {

            if (!Number.isFinite(packageDetails[field])) {
                throw new Error(
                    `Invalid calculated price: ${field}`
                );
            }
        }

        // ------------------------------------------
        // SEND RESPONSE
        // ------------------------------------------

        return res.status(200).json({

            success: true,

            destination: region,

            startingLocation: STARTING_LOCATION,

            departureDate,
            returnDate,

            days,
            minRating,
            travellers,

            totalAvailablePlaces: places.length,
            selectedPlacesCount: selectedPlaces.length,

            recommendations: selectedPlaces,

            itinerary,

            package: packageDetails,

            pricingInformation: {
                travelPerKm: PRICING.travelPerKm,
                localTransportPerDay: PRICING.localTransportPerDay,
                foodPerDay: PRICING.foodPerDay,
                accommodationPerNight: PRICING.accommodationPerNight,
                contingencyPercentage: PRICING.contingencyPercentage,
                maxPlacesPerDay: PRICING.maxPlacesPerDay,
                nearbyDistanceKm: PRICING.nearbyDistanceKm
            }

        });

    } catch (error) {

        console.error("Recommendation error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to generate recommendations.",
            error: error.message
        });
    }

});

module.exports = router;