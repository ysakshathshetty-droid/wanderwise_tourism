import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AfterLoginNavbar from "../components/AfterLoginNavbar";

function BookingSuccess() {

    const location = useLocation();
    const navigate = useNavigate();

    const booking = location.state?.booking;

    if (!booking || booking.paymentStatus !== "PAID") {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-2xl font-bold">
                        Booking information unavailable
                    </h2>

                    <button
                        onClick={() => navigate("/recommendations")}
                        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg"
                    >
                        Back to Recommendations
                    </button>

                </div>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-50">

            <AfterLoginNavbar />

            <div className="max-w-xl mx-auto px-5 py-16">

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {/* SUCCESS ICON */}

                    <div className="text-center mb-8">

                        <div className="w-20 h-20 bg-green-100
                        text-green-600 rounded-full flex items-center
                        justify-center text-5xl mx-auto">
                            ✓
                        </div>

                        <h1 className="text-3xl font-bold text-gray-800 mt-5">
                            Booking Confirmed!
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Your payment was completed successfully.
                        </p>

                    </div>

                    {/* BOOKING INFORMATION */}

                    <div className="border-t pt-6 space-y-4">

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Booking ID
                            </span>

                            <span className="font-semibold">
                                {booking.bookingId}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Destination
                            </span>

                            <span className="font-semibold">
                                {booking.destination}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Starting Location
                            </span>

                            <span className="font-semibold">
                                {booking.startingLocation}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Departure
                            </span>

                            <span className="font-semibold">
                                {booking.departureDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Return
                            </span>

                            <span className="font-semibold">
                                {booking.returnDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Travellers
                            </span>

                            <span className="font-semibold">
                                {booking.travellers}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Payment ID
                            </span>

                            <span className="font-semibold text-sm break-all max-w-48 text-right">
                                {booking.paymentId}
                            </span>
                        </div>

                        <hr />

                        <div className="flex justify-between text-lg">

                            <span className="font-semibold">
                                Amount Paid
                            </span>

                            <span className="font-bold text-green-600">
                                ₹{Number(booking.amount).toLocaleString("en-IN")}
                            </span>

                        </div>

                        <div className="flex justify-between">

                            <span className="text-gray-500">
                                Payment Status
                            </span>

                            <span className="font-bold text-green-600">
                                {booking.paymentStatus}
                            </span>

                        </div>

                    </div>

                    {/* HOME BUTTON */}

                    <button
                        onClick={() => navigate("/")}
                        className="w-full mt-8 bg-blue-600 hover:bg-blue-700
                        text-white font-semibold py-3 rounded-xl"
                    >
                        Back to Home
                    </button>

                </div>

            </div>

        </div>

    );

}

export default BookingSuccess;