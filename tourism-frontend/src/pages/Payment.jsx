import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AfterLoginNavbar from "../components/AfterLoginNavbar";

const API_URL = "http://localhost:5000/api";

function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const booking = location.state;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [packageDetails, setPackageDetails] = useState(null);

    // --------------------------------------------------
    // LOAD RAZORPAY CHECKOUT SCRIPT
    // --------------------------------------------------

    const loadRazorpay = () => {

        return new Promise((resolve) => {

            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.onload = () => resolve(true);

            script.onerror = () => resolve(false);

            document.body.appendChild(script);

        });
    };

    // --------------------------------------------------
    // HANDLE PAYMENT
    // --------------------------------------------------

    const handlePayment = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Please login again.");
            }

            if (!booking) {
                throw new Error("Booking details are missing.");
            }

            // Load Razorpay script

            const scriptLoaded = await loadRazorpay();

            if (!scriptLoaded) {
                throw new Error("Unable to load Razorpay.");
            }

            // ------------------------------------------
            // CREATE ORDER THROUGH BACKEND
            // ------------------------------------------

            const response = await fetch(
                `${API_URL}/payments/create-order`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        destination: booking.destination,

                        departureDate: booking.departureDate,

                        returnDate: booking.returnDate,

                        travellers: booking.travellers,

                        minRating: booking.minRating

                    })
                }
            );

            const orderData = await response.json();

            if (!response.ok || !orderData.success) {
                throw new Error(
                    orderData.message || "Unable to create payment order."
                );
            }

            // Store server-calculated package details

            setPackageDetails(orderData.package);

            // ------------------------------------------
            // RAZORPAY OPTIONS
            // ------------------------------------------

            const options = {

                key: orderData.key,

                amount: orderData.amount,

                currency: orderData.currency,

                name: "WanderWise",

                description: `Trip booking - ${booking.destination}`,

                order_id: orderData.orderId,

                // --------------------------------------
                // PAYMENT SUCCESS CALLBACK
                // --------------------------------------

                handler: async function (paymentResponse) {

                    try {

                        const verifyResponse = await fetch(
                            `${API_URL}/payments/verify`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`
                                },

                                body: JSON.stringify({

                                    razorpay_order_id:
                                        paymentResponse.razorpay_order_id,

                                    razorpay_payment_id:
                                        paymentResponse.razorpay_payment_id,

                                    razorpay_signature:
                                        paymentResponse.razorpay_signature

                                })
                            }
                        );

                        const verifyData = await verifyResponse.json();

                        if (
                            !verifyResponse.ok ||
                            !verifyData.success ||
                            verifyData.paymentStatus !== "PAID"
                        ) {
                            throw new Error(
                                verifyData.message ||
                                "Payment verification failed."
                            );
                        }

                        // Navigate after backend verification

                        navigate("/booking-success", {

                            state: {

                                booking: {

                                    bookingId: verifyData.bookingId,

                                    destination: verifyData.destination,

                                    startingLocation: "Bengaluru",

                                    departureDate: booking.departureDate,

                                    returnDate: booking.returnDate,

                                    travellers: booking.travellers,

                                    amount: verifyData.amount,

                                    paymentId: verifyData.paymentId,

                                    paymentStatus: verifyData.paymentStatus

                                }

                            }

                        });

                    } catch (err) {

                        setError(err.message);

                    }

                },

                // --------------------------------------
                // CHECKOUT CLOSED
                // --------------------------------------

                modal: {

                    ondismiss: function () {
                        setLoading(false);
                    }

                },

                theme: {
                    color: "#2563eb"
                }

            };

            const razorpay = new window.Razorpay(options);

            // ------------------------------------------
            // PAYMENT FAILURE
            // ------------------------------------------

            razorpay.on("payment.failed", function (response) {

                setError(
                    response.error.description ||
                    "Payment failed. Please try again."
                );

                setLoading(false);

            });

            razorpay.open();

            setLoading(false);

        } catch (err) {

            setError(err.message);

            setLoading(false);

        }

    };

    // --------------------------------------------------
    // CHECK BOOKING DETAILS
    // --------------------------------------------------

    if (!booking) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Booking details not found
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

    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (

        <div className="min-h-screen bg-gray-50">

            <AfterLoginNavbar />

            <div className="max-w-3xl mx-auto px-5 py-12">

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {/* HEADER */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-800">
                            Complete Your Booking
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Review your trip details before proceeding to payment.
                        </p>

                    </div>

                    {/* TRIP DETAILS */}

                    <div className="border rounded-xl p-6 space-y-4">

                        <h2 className="text-xl font-semibold text-gray-800">
                            Trip Details
                        </h2>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Destination</span>

                            <span className="font-semibold">
                                {booking.destination}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Starting Location</span>

                            <span className="font-semibold">
                                Bengaluru
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Departure Date</span>

                            <span className="font-semibold">
                                {booking.departureDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Return Date</span>

                            <span className="font-semibold">
                                {booking.returnDate}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Travellers</span>

                            <span className="font-semibold">
                                {booking.travellers}
                            </span>
                        </div>

                    </div>

                    {/* PACKAGE PRICE */}

                    {packageDetails && (

                        <div className="border rounded-xl p-6 mt-6">

                            <h2 className="text-xl font-semibold mb-5">
                                Package Summary
                            </h2>

                            <div className="space-y-3">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Bengaluru Travel
                                    </span>

                                    <span>
                                        ₹{packageDetails.bengaluruTravelCost}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Local Transport
                                    </span>

                                    <span>
                                        ₹{packageDetails.localTransportCost}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Food
                                    </span>

                                    <span>
                                        ₹{packageDetails.foodCost}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Accommodation
                                    </span>

                                    <span>
                                        ₹{packageDetails.accommodationCost}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Contingency
                                    </span>

                                    <span>
                                        ₹{packageDetails.contingency}
                                    </span>
                                </div>

                                <hr />

                                <div className="flex justify-between text-xl font-bold">

                                    <span>Total Amount</span>

                                    <span className="text-blue-600">
                                        ₹{packageDetails.total.toLocaleString("en-IN")}
                                    </span>

                                </div>

                                <p className="text-sm text-gray-500">
                                    ₹{packageDetails.perPersonTotal.toLocaleString("en-IN")}
                                    {" "}per person
                                </p>

                            </div>

                        </div>

                    )}

                    {/* PAYMENT NOTE */}

                    {!packageDetails && (

                        <p className="text-gray-500 text-sm mt-6">
                            Your final package amount will be calculated securely
                            by our server when you proceed to payment.
                        </p>

                    )}

                    {/* ERROR */}

                    {error && (

                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-6">

                            {error}

                        </div>

                    )}

                    {/* PAYMENT BUTTON */}

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full mt-8 bg-blue-600 hover:bg-blue-700
                        text-white font-semibold py-4 rounded-xl
                        transition disabled:opacity-50"
                    >

                        {loading
                            ? "Processing..."
                            : "Proceed to Payment"
                        }

                    </button>

                    <p className="text-center text-gray-400 text-sm mt-4">
                        Secure payment powered by Razorpay
                    </p>

                </div>

            </div>

        </div>

    );

}

export default Payment;