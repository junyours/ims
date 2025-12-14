import useAppState from "../../store/useAppState";
import { useQuery } from "@tanstack/react-query";
import { violatorsDetails } from "../../functions/ReportsApi";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

const ViolatorsDetails = () => {
    const { darkMode, token, base_url } = useAppState();
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: violator,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["violator_details", id],
        queryFn: () => violatorsDetails({ base_url, token, id }),
    });

    // --- PAGINATION LOGIC ---
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;

    const paginatedRecords = useMemo(() => {
        if (!violator?.reports) return [];
        const start = (currentPage - 1) * recordsPerPage;
        return violator.reports.slice(start, start + recordsPerPage);
    }, [violator, currentPage]);

    const totalPages = violator?.reports
        ? Math.ceil(violator.reports.length / recordsPerPage)
        : 0;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // --- LOADING & ERROR STATES ---
    if (isLoading)
        return (
            <div className="flex justify-center items-center mt-20 text-gray-500 dark:text-gray-400">
                <p className="font-bold text-2xl animate-pulse">Loading...</p>
            </div>
        );

    if (isError || !violator)
        return (
            <p className="text-center mt-10 text-lg text-gray-500 dark:text-gray-400">
                No record found.
            </p>
        );

    return (
        <motion.div
            layout
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="px-4 md:px-8 py-6 space-y-6 max-w-5xl mx-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Violator Details
                </h2>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400 transition-colors font-semibold text-white"
                >
                    Back
                </button>
            </div>

            {/* Violator Info */}
            <motion.div
                layout
                className={`flex flex-col md:flex-row items-center space-x-0 md:space-x-6 bg-white/30 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700`}
            >
                <img
                    src={violator?.photo}
                    alt={violator?.first_name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-slate-700"
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:mt-0 text-gray-800 dark:text-gray-200">
                    <div className="space-y-2">
                        <p>
                            <span className="font-semibold">Name:</span>{" "}
                            {violator?.first_name} {violator?.last_name}
                        </p>
                        <p>
                            <span className="font-semibold">Age:</span>{" "}
                            {violator?.age}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p>
                            <span className="font-semibold">Address:</span>{" "}
                            {violator?.address}
                        </p>
                        <p>
                            <span className="font-semibold">Zone:</span>{" "}
                            {violator?.zone?.zone_name}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Violator Records */}
            <motion.div
                layout
                className={`bg-white/30 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4`}
            >
                <h3 className="text-xl font-semibold border-b pb-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    Violator Records
                </h3>

                {paginatedRecords.length > 0 ? (
                    <div className="space-y-4">
                        {paginatedRecords.map((record) => (
                            <motion.div
                                key={record.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                }}
                                className={`flex justify-between items-center p-4 rounded-xl shadow-sm border ${
                                    darkMode
                                        ? "bg-slate-900 border-slate-700"
                                        : "bg-gray-50 border-gray-200"
                                }`}
                            >
                                {/* Left: Info */}
                                <div className="flex flex-col md:flex-row gap-8 flex-1 text-gray-900 dark:text-white">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">
                                            Category:{" "}
                                            <span className="text-green-500">
                                                {
                                                    record?.incident_type
                                                        ?.category
                                                        ?.category_name
                                                }
                                            </span>
                                        </p>
                                        <p className="text-sm font-semibold">
                                            Type:{" "}
                                            <span className="text-green-500">
                                                {
                                                    record?.incident_type
                                                        ?.incident_name
                                                }
                                            </span>
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm">
                                            Date:{" "}
                                            <span className="font-medium">
                                                {record?.date}
                                            </span>
                                        </p>
                                        <p className="text-sm">
                                            Time:{" "}
                                            <span className="font-medium">
                                                {new Date(
                                                    `1970-01-01T${record?.time}`
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </span>
                                        </p>
                                        <p className="text-sm">
                                            Address:{" "}
                                            <span className="font-medium">
                                                {
                                                    record?.location?.zone
                                                        ?.zone_name
                                                }
                                                ,{" "}
                                                {
                                                    record?.location
                                                        ?.location_name
                                                }
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Right: View Button */}
                                <div className="flex-shrink-0">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/report-details/${record.id}`
                                            )
                                        }
                                        className="bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                                    >
                                        View
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="italic text-gray-500 dark:text-gray-400">
                        No records available.
                    </p>
                )}

                {/* PAGINATION CONTROLS */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg border text-sm font-semibold dark:text-white bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 disabled:opacity-50 transition-all"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
                                    currentPage === i + 1
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg border text-sm font-semibold dark:text-white bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 disabled:opacity-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ViolatorsDetails;
