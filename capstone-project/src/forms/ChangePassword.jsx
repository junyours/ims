import useAppState from "../store/useAppState";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { changePassword } from "../functions/AuthApi";
import SuccessAlert from "../components/alerts/SuccessAlert";

const ChangePassword = ({ onClose }) => {
    const { token, base_url, darkMode, user } = useAppState();
    const [isAlertMessageOpen, setIsAlertMessageOpen] = useState(false);
    const userId = user?.id;

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [error, setError] = useState("");

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.25 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 40 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.35, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 40,
            transition: { duration: 0.25, ease: "easeIn" },
        },
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🔥 API submit
    const mutation = useMutation({
        mutationFn: () => changePassword({ base_url, token, formData, userId }),
        onSuccess: () => {
            setIsAlertMessageOpen(true);

            setTimeout(() => {
                setIsAlertMessageOpen(false);
                onClose();
            }, 1500);
        },

        onError: (err) => {
            setError(err.message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            return setError("New passwords do not match.");
        }

        if (formData.newPassword.length < 6) {
            return setError("New password must be at least 6 characters.");
        }

        mutation.mutate();
    };

    return (
        <AnimatePresence>
            <motion.div
                className={`fixed inset-0 flex items-center justify-center z-50 
                    ${darkMode ? "bg-black/60" : "bg-black/40"}`}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                {/* MODAL */}
                <motion.div
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                    >
                        ×
                    </button>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
                        Change Password
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                        {/* --- FIELD TEMPLATE --- */}
                        {[
                            ["Current Password", "currentPassword", "current"],
                            ["New Password", "newPassword", "new"],
                            [
                                "Confirm New Password",
                                "confirmPassword",
                                "confirm",
                            ],
                        ].map(([label, field, showKey]) => (
                            <div key={field}>
                                <label className="text-gray-600 dark:text-gray-300 text-sm">
                                    {label}
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type={
                                            show[showKey] ? "text" : "password"
                                        }
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border dark:border-gray-700 
                                            bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-white 
                                            focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                    <span
                                        onClick={() =>
                                            setShow((prev) => ({
                                                ...prev,
                                                [showKey]: !prev[showKey],
                                            }))
                                        }
                                        className="absolute right-3 top-2.5 cursor-pointer text-gray-500 dark:text-gray-300"
                                    >
                                        {show[showKey] ? "🙈" : "👁️"}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-sm font-medium">
                                {error}
                            </p>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={mutation.isPending}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium shadow-md transition disabled:opacity-50"
                        >
                            {mutation.isPending
                                ? "Updating..."
                                : "Update Password"}
                        </motion.button>
                    </form>
                </motion.div>
            </motion.div>

            {/* Success Alert */}
            {isAlertMessageOpen && <SuccessAlert />}
        </AnimatePresence>
    );
};

export default ChangePassword;
