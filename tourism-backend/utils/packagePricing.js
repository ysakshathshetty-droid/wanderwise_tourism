// --------------------------------------------------
// FIXED STARTING LOCATION
// --------------------------------------------------

const STARTING_LOCATION = "Bengaluru";

const BENGALURU = {
    latitude: 12.9716,
    longitude: 77.5946
};

// --------------------------------------------------
// AFFORDABLE PACKAGE PRICING
// --------------------------------------------------

const PRICING = {
    travelPerKm: 3,
    roadDistanceMultiplier: 1.2,

    localTransportPerDay: 300,
    foodPerDay: 300,
    accommodationPerNight: 900,

    contingencyPercentage: 5,

    maxPlacesPerDay: 3,
    nearbyDistanceKm: 30
};

// --------------------------------------------------
// VALIDATE NUMBER
// --------------------------------------------------

function validNumber(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number) ? number : fallback;
}

// --------------------------------------------------
// HAVERSINE DISTANCE
// --------------------------------------------------

function calculateDistance(lat1, lon1, lat2, lon2) {

    const earthRadius = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return earthRadius * c;
}

// --------------------------------------------------
// CHECK COORDINATES
// --------------------------------------------------

function hasCoordinates(place) {

    const latitude = Number(place.latitude);
    const longitude = Number(place.longitude);

    return (
        place.latitude !== null &&
        place.longitude !== null &&
        place.latitude !== undefined &&
        place.longitude !== undefined &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );
}

// --------------------------------------------------
// REGION CENTRE
// --------------------------------------------------

function calculateRegionCentre(places) {

    const validPlaces = places.filter(hasCoordinates);

    if (validPlaces.length === 0) {
        return null;
    }

    const latitude =
        validPlaces.reduce(
            (sum, place) => sum + Number(place.latitude),
            0
        ) / validPlaces.length;

    const longitude =
        validPlaces.reduce(
            (sum, place) => sum + Number(place.longitude),
            0
        ) / validPlaces.length;

    return { latitude, longitude };
}

// --------------------------------------------------
// COMPLETE PACKAGE PRICE
// --------------------------------------------------

function calculatePackagePrice(
    oneWayDistance,
    days,
    travellers
) {

    const nights = Math.max(days, 0);

    const oneWayRoadDistance =
        oneWayDistance * PRICING.roadDistanceMultiplier;

    const roundTripDistance =
        oneWayRoadDistance * 2;

    const bengaluruTravelPerPerson =
        roundTripDistance * PRICING.travelPerKm;

    const localTransportPerPerson =
        days * PRICING.localTransportPerDay;

    const foodPerPerson =
        days * PRICING.foodPerDay;

    const accommodationPerPerson =
        nights * PRICING.accommodationPerNight;

    const bengaluruTravelCost =
        bengaluruTravelPerPerson * travellers;

    const localTransportCost =
        localTransportPerPerson * travellers;

    const foodCost =
        foodPerPerson * travellers;

    const accommodationCost =
        accommodationPerPerson * travellers;

    const subtotal =
        bengaluruTravelCost +
        localTransportCost +
        foodCost +
        accommodationCost;

    const contingency =
        subtotal * PRICING.contingencyPercentage / 100;

    const total = subtotal + contingency;

    const perPersonTotal = total / travellers;

    return {
        startingLocation: STARTING_LOCATION,

        oneWayDistance: Number(oneWayRoadDistance.toFixed(2)),
        roundTripDistance: Number(roundTripDistance.toFixed(2)),

        days,
        nights,
        travellers,

        bengaluruTravelCost: Math.round(bengaluruTravelCost),
        localTransportCost: Math.round(localTransportCost),
        foodCost: Math.round(foodCost),
        accommodationCost: Math.round(accommodationCost),

        subtotal: Math.round(subtotal),
        contingency: Math.round(contingency),

        total: Math.round(total),
        perPersonTotal: Math.round(perPersonTotal),

        currency: "INR",
        estimated: true
    };
}

module.exports = {
    STARTING_LOCATION,
    BENGALURU,
    PRICING,
    validNumber,
    calculateDistance,
    hasCoordinates,
    calculateRegionCentre,
    calculatePackagePrice
};