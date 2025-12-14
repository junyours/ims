import useAppState from "../store/useAppState";
import { useQuery } from "@tanstack/react-query";
import { getTanodUser } from "../functions/UsersApi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TanodCard = () => {
    const { base_url, token } = useAppState();
    const navigate = useNavigate();

    const { data } = useQuery({
        queryKey: ["volunteers"],
        queryFn: () => getTanodUser({ base_url, token }),
    });

    if (!data || data.length === 0) {
        return (
            <p className="text-gray-500 dark:text-gray-300 text-center">
                No volunteers found.
            </p>
        );
    }

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: (i) => ({
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                ease: "easeOut",
            },
        }),
    };

    return (
        <div className="flex flex-wrap gap-6">
            {data.map((volunteer, index) => {
                const profile = volunteer.profile;
                const fullName = volunteer.name;

                return (
                    <motion.div
                        key={volunteer.id}
                        className="relative w-54 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group"
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        whileHover={{ scale: 1.05 }}
                    >
                        {/* Hover accent glow */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-green-300/20 to-blue-400/20 transition-opacity duration-300 rounded-2xl"></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center p-5">
                            {/* Avatar */}
                            {profile?.photo ? (
                                <img
                                    className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-md transition-transform duration-300 group-hover:scale-105"
                                    src={profile.photo}
                                    alt={fullName}
                                />
                            ) : (
                                <IoPersonCircleOutline className="h-24 w-24 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                            )}

                            {/* Name */}
                            <h3 className="mt-4 font-bold text-lg text-gray-800 dark:text-white group-hover:text-green-500 transition-colors duration-300">
                                {fullName}
                            </h3>

                            {/* Details */}
                            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center space-y-1">
                                <p>
                                    <span className="font-medium">Role:</span>{" "}
                                    {volunteer.role}
                                </p>
                                <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    {volunteer.status}
                                </p>
                            </div>

                            {/* Hover action */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-3">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/tanod/details/${volunteer.id}`
                                        )
                                    }
                                    className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-full shadow hover:bg-green-700 transition"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TanodCard;
