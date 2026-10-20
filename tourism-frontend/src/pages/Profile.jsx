import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AfterLoginNavbar from "../components/AfterLoginNavbar";
import { updateProfile } from "../services/authService";

function Profile() {
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || ""
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            const data = await updateProfile({
                name: formData.name.trim(),
                email: formData.email.trim()
            });

            // Update locally stored user information.
            const oldUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const updatedUser = {
                ...oldUser,
                ...(data.user || {}),
                name: formData.name.trim(),
                email: formData.email.trim()
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f6]">
            <AfterLoginNavbar />

            <main className="max-w-2xl mx-auto px-4 py-10">
                <div className="bg-white rounded-2xl border border-[#D5E3D5] shadow-sm p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Edit Profile
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Update your WanderWise account information.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-700"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-xl bg-emerald-800 text-white py-3 font-semibold hover:bg-emerald-900 disabled:opacity-50"
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <Link
                                to="/dashboard"
                                className="flex-1 text-center rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Profile;