import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useVolunteers from "../hooks/useVolunteers";
import useAppState from "../store/useAppState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateNotification } from "../functions/Notification";
import { notifications } from "../functions/Notification";

const Notification = ({ message, onClose, duration = 7000 }) => {
    const { darkMode, categories, base_url, token } = useAppState();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: volunteers = [] } = useVolunteers();

    const reportedBy = volunteers.find(
        (user) => Number(user.id) === Number(message?.report?.user_id)
    );

    const category = categories.find((cat) => cat.id === message?.category_id);

    // Auto close after duration
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!message) return null;

    const mutation = useMutation({
        mutationFn: ({ id }) => updateNotification({ base_url, token, id }),
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });

    const handleNotificationClick = async (id, path) => {
        await mutation.mutateAsync({ id });
        onClose();
        if (path) navigate(path);
    };

    const renderContent = () => {
        // Sighting Event
        if (message.sighting_report) {
            const sighting = message.sighting_report;
            return (
                <>
                    <h2 className="text-lg font-bold mb-2">👀 Sighting Reported</h2>
                    <p>
                        <strong>Location:</strong> {sighting.location}
                    </p>
                    <p>
                        <strong>Reported By:</strong>{" "}
                        {sighting.user?.name || "Anonymous"}
                    </p>
                    <p className="text-gray-500 text-xs">
                        {new Date(sighting.created_at).toLocaleString()}
                    </p>
                    <div className="text-right mt-4">
                        <button
                            onClick={() =>
                                handleNotificationClick(
                                    message.id,
                                    `/sighting-details/${sighting.id}`
                                )
                            }
                            className={`px-4 py-2 rounded text-white transition ${
                                darkMode
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            View Sighting
                        </button>
                    </div>
                </>
            );
        }
        else if (message.category_id) {
            return (
                <>
                    <h2 className="text-lg font-bold mb-2">🚨 Emergency!</h2>
                    <p>
                        <strong>Incident Category:</strong>{" "}
                        {category ? category.category_name : "Unknown"}
                    </p>
                    <div className="text-right mt-4">
                        <button
                            onClick={() =>
                                handleNotificationClick(
                                    message.id,
                                    "/incident-request"
                                )
                            }
                            className={`px-4 py-2 rounded text-white transition ${
                                darkMode
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            View Location
                        </button>
                    </div>
                </>
            );
        }

        // Violator Event
        if (message.violator) {
            const violator = message.violator;
            return (
                <>
                    <h2 className="text-lg font-bold mb-2">👮 New Violator Profile</h2>
                    <p>
                        <strong>Name:</strong> {violator.first_name} {violator.last_name}
                    </p>
                    <p>
                        <strong>Age:</strong> {violator.age}
                    </p>
                    <p>
                        <strong>Address:</strong> {violator.address}
                    </p>
                    <div className="text-right mt-4">
                        <button
                            onClick={() =>
                                handleNotificationClick(
                                    message.id,
                                    `/violators-details/${violator.id}`
                                )
                            }
                            className={`px-4 py-2 rounded text-white transition ${
                                darkMode
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                            View Profile
                        </button>
                    </div>
                </>
            );
        }

        // Default / General notification
        return (
            <>
                <h2 className="text-lg font-bold mb-2">🔔 Notification</h2>
                <p>
                    <strong>Report Submitted By:</strong>{" "}
                    {reportedBy ? reportedBy.name : "Anonymous"}
                </p>
                <div className="text-right mt-4">
                    <button
                        onClick={() =>
                            handleNotificationClick(
                                message?.id,
                                `/report-details/${message?.report?.id}`
                            )
                        }
                        className={`px-4 py-2 rounded text-white transition ${
                            darkMode
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                        View Report
                    </button>
                </div>
            </>
        );
    };

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className={`fixed top-20 right-5 z-50 w-full max-w-sm rounded-lg shadow-lg p-4 ${
                        darkMode
                            ? "bg-slate-900 text-white"
                            : "bg-white text-gray-800"
                    }`}
                >
                    {renderContent()}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Notification;

