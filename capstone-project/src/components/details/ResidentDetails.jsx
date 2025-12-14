import useAppState from "../../store/useAppState";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { blockUser, unBlockUser } from "../../functions/AuthApi";
import { getResidents, requestRecords } from "../../functions/ReportsApi";
import { useParams } from "react-router-dom";
import SuccessAlert from "../alerts/SuccessAlert";
import { motion } from "framer-motion";
import { useState } from "react";

const ResidentDetails = () => {
    const { base_url, token, darkMode } = useAppState();
    const { id } = useParams();
    const qc = useQueryClient();
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const [successOpen, setSuccessOpen] = useState(false);

    const { data: residents } = useQuery({
        queryKey: ["residents"],
        queryFn: () => getResidents({ base_url, token }),
    });

    const profile = residents?.find((r) => r.id === Number(id));

    const { data: records = [] } = useQuery({
        queryKey: ["request_records"],
        queryFn: () => requestRecords({ base_url, token }),
    });

    const resident_records = records.filter((r) => r.user_id === Number(id));

    // Pagination logic
    const totalPages = Math.ceil(resident_records.length / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const currentRecords = resident_records.slice(
        startIndex,
        startIndex + recordsPerPage
    );

    const getVisiblePages = () => {
        const maxVisible = 3;
        const startPage = Math.max(
            1,
            Math.min(currentPage - 1, totalPages - maxVisible + 1)
        );
        return Array.from(
            { length: Math.min(maxVisible, totalPages) },
            (_, i) => startPage + i
        );
    };

    // Mutations
    const blockMutation = useMutation({
        mutationFn: ({ userId }) => blockUser({ base_url, token, userId }),
        onSuccess: () => {
            qc.invalidateQueries(["residents"]);
            setSuccessOpen(true);
            setTimeout(() => {
                setSuccessOpen(false);
                onClose();
            }, 3000);
        },
        onError: (error) => {
            console.error("Error blocking user:", error);
            alert("Failed to block user. Please try again.");
        },
    });

    const unBlockMutation = useMutation({
        mutationFn: ({ userId }) => unBlockUser({ base_url, token, userId }),
        onSuccess: () => {
            qc.invalidateQueries(["residents"]);
            setSuccessOpen(true);
            setTimeout(() => {
                setSuccessOpen(false);
                onClose();
            }, 3000);
        },
        onError: (error) => {
            console.error("Error unblocking user:", error);
            alert("Failed to unblock user. Please try again.");
        },
    });

    // Handlers
    const handleBlockUser = () => {
        blockMutation.mutate({ userId: profile.id });
    };

    const handleUnBlockUser = () => {
        unBlockMutation.mutate({ userId: profile.id });
    };

    return (
        <div className="flex flex-col mt-8 items-center gap-8 max-w-5xl mx-auto px-4">
            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex flex-col items-center gap-5 w-full p-8 rounded-3xl border shadow-xl
                    backdrop-blur-md bg-gradient-to-br ${
                        darkMode
                            ? "from-gray-800/80 to-gray-900/90 border-gray-700"
                            : "from-white/90 to-gray-100/80 border-gray-200"
                    }`}
            >
                <div className="flex flex-col md:flex-row w-full gap-8 items-center">
                    {/* User Image */}
                    <div className="flex-shrink-0">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Identification
                        </h3>
                        {profile?.identification ? (
                            <img
                                src={profile.identification}
                                alt="Identification"
                                className="h-48 w-auto rounded-xl border border-gray-300 dark:border-gray-700 shadow-md object-cover"
                            />
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic">
                                No identification uploaded.
                            </p>
                        )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 grid gap-3 text-gray-800 dark:text-gray-300">
                        <p>
                            <span className="font-bold uppercase">Name: </span>
                            {profile?.name}
                        </p>
                        <p>
                            <span className="font-bold uppercase">Role: </span>
                            {profile?.role}
                        </p>
                        <p>
                            <span className="font-bold uppercase">
                                Status:{" "}
                            </span>
                            <span
                                className={`font-bold ${
                                    profile?.status === "active"
                                        ? "text-green-700 dark:text-green-300"
                                        : profile?.status === "inactive"
                                        ? "text-yellow-700 dark:text-yellow-300"
                                        : "text-red-700 dark:text-red-300"
                                }`}
                            >
                                {profile?.status}
                            </span>
                        </p>

                        <div className="mt-5">
                            {profile?.status === "block" ? (
                                <button
                                    onClick={handleUnBlockUser}
                                    disabled={unBlockMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium shadow-md transition-all duration-300 ease-in-out disabled:opacity-70"
                                >
                                    {unBlockMutation.isPending
                                        ? "Unblocking..."
                                        : "UnBlock"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleBlockUser}
                                    disabled={blockMutation.isPending}
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium shadow-md transition-all duration-300 ease-in-out disabled:opacity-70"
                                >
                                    {blockMutation.isPending
                                        ? "Blocking..."
                                        : "Block"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Records Table */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className={`w-full rounded-2xl border shadow-md overflow-hidden ${
                    darkMode
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-200"
                }`}
            >
                <div
                    className={`px-6 py-3 text-lg font-bold ${
                        darkMode
                            ? "bg-gray-800 text-gray-100"
                            : "bg-gray-50 text-gray-800"
                    }`}
                >
                    Incident Records
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead
                            className={`text-xs uppercase font-semibold tracking-wider ${
                                darkMode
                                    ? "bg-gray-800 text-gray-300"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            <tr>
                                <th className="px-6 py-3 text-center">ID</th>
                                <th className="px-6 py-3 text-center">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-center">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.length > 0 ? (
                                currentRecords.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        className={`transition-all ${
                                            index % 2 === 0
                                                ? darkMode
                                                    ? "bg-gray-800/60"
                                                    : "bg-white"
                                                : darkMode
                                                ? "bg-gray-900/50"
                                                : "bg-gray-50"
                                        } hover:bg-blue-50 dark:hover:bg-blue-900/30`}
                                    >
                                        <td className="px-6 py-3 text-center text-gray-900 dark:text-gray-100">
                                            {record.id}
                                        </td>
                                        <td className="px-6 py-3 text-center text-gray-900 dark:text-gray-100">
                                            {record.category?.category_name}
                                        </td>
                                        <td
                                            className={`px-6 py-3 text-center font-semibold ${
                                                record.status === "ongoing"
                                                    ? "text-yellow-600 dark:text-yellow-400"
                                                    : record.status === "done"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {record.status}
                                        </td>
                                        <td className="px-6 py-3 text-center text-gray-900 dark:text-gray-100">
                                            {new Date(
                                                record.created_at
                                            ).toLocaleString([], {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-6 text-center text-gray-500 dark:text-gray-400 italic"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 py-4">
                        <button
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg border text-sm font-semibold dark:text-white bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 disabled:opacity-50 transition-all"
                        >
                            Previous
                        </button>

                        {getVisiblePages().map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all
                                ${
                                    page === currentPage
                                        ? "bg-green-600 text-white border-green-600"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg border text-sm font-semibold dark:text-white bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 disabled:opacity-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </motion.div>
            {successOpen && <SuccessAlert />}
        </div>
    );
};

export default ResidentDetails;
