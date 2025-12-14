import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useState } from "react";
import useAppState from "../../store/useAppState";
import { respondersRecords, respondersStats } from "../../functions/UsersApi";
import UpdateTanod from "./UpdateTanod";

const TanodDetails = () => {
    const { id } = useParams();
    const qc = useQueryClient();
    const { base_url, token } = useAppState();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showRespondedOnly, setShowRespondedOnly] = useState(false);
    const [viewFeedback, setViewFeedback] = useState(false);
    const recordsPerPage = 5;

    const tanodData = qc.getQueryData(["volunteers"]);
    const tanod = tanodData?.find((u) => u.id === Number(id));

    const { data: records = [], isLoading } = useQuery({
        queryKey: ["records", id],
        queryFn: () => respondersRecords({ base_url, token, id }),
    });

    const { data: stats } = useQuery({
        queryKey: ["stats", id],
        queryFn: () => respondersStats({ base_url, token, id }),
        enabled: !!id,
    });

    if (!tanod)
        return (
            <div className="flex justify-center mt-20 text-gray-500 dark:text-gray-300">
                Volunteer not found.
            </div>
        );

    const toggleRespondedFilter = () => {
        setShowRespondedOnly((prev) => !prev);
        setCurrentPage(1);
    };

    const filteredRecords = showRespondedOnly
        ? records.filter((r) => r.response_record)
        : records;

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredRecords.slice(
        indexOfFirstRecord,
        indexOfLastRecord
    );
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

    const handlePageChange = (page) => setCurrentPage(page);

    const totalIncidents = records.length;
    const profile = tanod.profile;

    return (
        <div className="px-4 md:px-8 py-6 space-y-6 max-w-6xl mx-auto">
            {/* Header Card */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/30 dark:bg-gray-900/40 backdrop-blur-lg rounded-3xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full">
                <div className="flex items-center gap-5">
                    {profile?.photo ? (
                        <img
                            src={profile.photo}
                            alt={tanod.name}
                            className="h-28 w-28 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                        />
                    ) : (
                        <IoPersonCircleOutline className="h-28 w-28 text-gray-400" />
                    )}

                    <div className="space-y-1">
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            {tanod.name}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Role: {tanod.role}
                        </p>
                        <span
                            className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                                tanod.status === "active"
                                    ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
                            }`}
                        >
                            {tanod.status.toUpperCase()}
                        </span>
                        <div className="mt-3">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="px-4 py-2 rounded-lg font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md flex items-center gap-2"
                            >
                                <IoPersonCircleOutline className="text-lg" />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                    {[
                        {
                            title: "Reported Incidents",
                            value: totalIncidents,
                            bg: "red",
                        },
                        {
                            title: "Avg Response Time",
                            value:
                                stats?.response_time >= 60
                                    ? `${(stats.response_time / 60).toFixed(
                                          1
                                      )} hr`
                                    : `${stats?.response_time ?? 0} min`,
                            bg: "green",
                        },
                        {
                            title: "Performance Rating",
                            value: `${stats?.rating ?? 0}/5`,
                            bg: "yellow",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.title}
                            className={`p-4 rounded-2xl shadow-md dark:border-${stat.bg}-800 text-center bg-${stat.bg}-50 dark:bg-${stat.bg}-600/30`}
                        >
                            <h1
                                className={`text-sm font-semibold text-${stat.bg}-700 dark:text-${stat.bg}-300`}
                            >
                                {stat.title}
                            </h1>
                            <p
                                className={`text-2xl font-bold text-${stat.bg}-600 dark:text-${stat.bg}-300`}
                            >
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Toggle Buttons */}
            <div className="flex justify-end max-w-5xl mx-auto gap-2 mt-4">
                <button
                    onClick={toggleRespondedFilter}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm ${
                        showRespondedOnly
                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    {showRespondedOnly
                        ? "Show All Records"
                        : "Show With Response"}
                </button>

                <button
                    onClick={() => setViewFeedback((prev) => !prev)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200 shadow-sm ${
                        viewFeedback
                            ? "bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600"
                            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    {viewFeedback ? "View Records" : "View Feedback"}
                </button>
            </div>

            {/* Records / Feedback Section */}
            {isLoading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading records...
                </div>
            ) : viewFeedback ? (
                <div className="space-y-4 max-w-5xl mx-auto scrollbar-hide max-h-[500px] overflow-y-auto">
                    {stats?.feedback?.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No feedback found.
                        </div>
                    ) : (
                        stats.feedback.map((fb) => (
                            <motion.div
                                key={fb.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow"
                            >
                                <div className="flex items-center">
                                    <IoPersonCircleOutline className="h-16 w-16 text-gray-400" />
                                    <div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {fb?.user?.name ||
                                                "No comment provided."}
                                        </p>
                                        <p className="text-gray-600 text-xs dark:text-gray-300">
                                            {fb?.user?.role ||
                                                "No comment provided."}
                                        </p>
                                    </div>
                                </div>
                                <p className="font-semibold text-gray-800 dark:text-white mb-2 text-lg flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <span
                                            key={i}
                                            className={
                                                i < fb.rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                            }
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        {fb.rating}/5
                                    </span>
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Feedback:{" "}
                                    {fb.feedback || "No comment provided."}
                                </p>
                            </motion.div>
                        ))
                    )}
                </div>
            ) : (
                <div className="space-y-4 max-w-5xl mx-auto scrollbar-hide max-h-[500px] overflow-y-auto">
                    {currentRecords.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No records found.
                        </div>
                    ) : (
                        currentRecords.map((record) => (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() =>
                                    navigate(`/report-details/${record.id}`)
                                }
                                className="w-full p-4 rounded-2xl bg-white/40 dark:bg-gray-800/40 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow hover:shadow-xl cursor-pointer transition-transform transform hover:-translate-y-1"
                            >
                                <p className="font-semibold text-gray-800 dark:text-white mb-2 text-lg">
                                    {record.incident_type?.category
                                        ?.category_name ?? "Unknown"}{" "}
                                    –{" "}
                                    {record.incident_type?.incident_name ??
                                        "N/A"}
                                </p>
                                <div className="flex flex-col md:flex-row justify-between text-sm text-gray-600 dark:text-gray-300">
                                    <div className="space-y-1">
                                        <p>
                                            <span className="font-medium">
                                                Zone:
                                            </span>{" "}
                                            {record.location?.zone?.zone_name ??
                                                "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Location:
                                            </span>{" "}
                                            {record.location?.location_name ??
                                                "N/A"}
                                        </p>
                                    </div>
                                    <p className="mt-2 md:mt-0">
                                        <span className="font-medium">
                                            Date:
                                        </span>{" "}
                                        {record.date} •{" "}
                                        <span className="font-medium">
                                            Time:
                                        </span>{" "}
                                        {record.time
                                            ? new Date(
                                                  `1970-01-01T${record.time}`
                                              ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  hour12: true,
                                              })
                                            : "N/A"}
                                    </p>
                                </div>

                                {record.response_record && (
                                    <div className="mt-3 flex flex-col md:flex-row justify-between text-sm text-gray-600 dark:text-gray-300">
                                        <p>
                                            <span className="font-medium">
                                                Requester:
                                            </span>{" "}
                                            {record.response_record?.request
                                                ?.user?.name ?? "N/A"}
                                        </p>
                                        <div className="flex gap-4 mt-2 md:mt-0">
                                            <p>
                                                <span className="font-medium">
                                                    Distance:
                                                </span>{" "}
                                                {record.response_record
                                                    ?.distance ?? "N/A"}{" "}
                                                km
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Response Time:
                                                </span>{" "}
                                                {record.response_record
                                                    ?.response_time ??
                                                    "N/A"}{" "}
                                                mins
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !viewFeedback && (
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
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
                                currentPage === i + 1
                                    ? "bg-green-500 text-white border-green-500"
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

            {/* UpdateTanod Modal */}
            {isOpen && (
                <UpdateTanod
                    tanod={tanod}
                    tanodId={id}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default TanodDetails;
