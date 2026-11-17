import React, { useEffect, useState } from "react";

const UpcomingJourney = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpcomingBookings = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/bookings/upcoming",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setBookings(data.bookings || []);
                }
            } catch (error) {
                console.error("Error fetching journeys:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingBookings();
    }, []);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            timeZone: "UTC"
        });
    };

    if (loading) {
        return <p className="text-gray-500">Loading upcoming journeys...</p>;
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6">

            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-gray-800">
                    Upcoming Journeys
                </h2>

                <span className="text-sm text-blue-600 font-medium">
                    {bookings.length} Bookings
                </span>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-4xl mb-3">✈️</div>

                    <h3 className="font-semibold text-gray-700">
                        No Upcoming Journeys
                    </h3>

                    <p className="text-sm text-gray-500 mt-2">
                        Your confirmed trips will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">

                    {bookings.map((booking) => (
                        <div
                            key={booking.booking_id}
                            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition"
                        >

                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">
                                        {booking.destination}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Starting from {booking.starting_location}
                                    </p>
                                </div>

                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Confirmed
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Departure
                                    </p>
                                    <p className="font-semibold text-sm">
                                        {formatDate(booking.departure_date)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Return
                                    </p>
                                    <p className="font-semibold text-sm">
                                        {formatDate(booking.return_date)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Travellers
                                    </p>
                                    <p className="font-semibold text-sm">
                                        {booking.travellers}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Amount Paid
                                    </p>
                                    <p className="font-semibold text-sm text-green-600">
                                        ₹{Number(booking.total_amount).toLocaleString("en-IN")}
                                    </p>
                                </div>

                            </div>

                            <div className="border-t mt-4 pt-3 flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Booking ID: #{booking.booking_id}
                                </span>

                                <span className="text-green-600 font-semibold">
                                    Payment Successful
                                </span>
                            </div>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
};

export default UpcomingJourney;