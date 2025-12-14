import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import useAppState from "../../store/useAppState";
import { getResidents } from "../../functions/ReportsApi";
import { useNavigate } from "react-router-dom";

const ResidentsTable = () => {
    const { base_url, token, darkMode } = useAppState();
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const {
        data: residents,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["residents"],
        queryFn: () => getResidents({ base_url, token }),
    });

    // Filtered residents by status
    const filteredResidents = useMemo(() => {
        if (!residents) return [];
        if (!statusFilter) return residents;
        return residents.filter((r) => r.status === statusFilter);
    }, [residents, statusFilter]);

    // Paginated residents
    const paginatedResidents = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredResidents.slice(startIndex, endIndex);
    }, [filteredResidents, currentPage]);

    const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);

    if (isLoading)
        return (
            <p className={darkMode ? "text-gray-200" : "text-gray-700"}>
                Loading...
            </p>
        );
    if (isError)
        return (
            <p className={darkMode ? "text-gray-200" : "text-gray-700"}>
                Failed to load residents.
            </p>
        );

    const statuses = ["active", "inactive", "block"];

    return (
        <motion.div className="p-2">
            <div
                className={`overflow-x-auto mt-4 rounded-xl shadow-lg border ${
                    darkMode
                        ? "bg-slate-900 border-slate-700"
                        : "bg-white border-gray-200"
                }`}
            >
                <table className="min-w-full divide-y text-sm">
                    <thead
                        className={`sticky top-0 z-10 ${
                            darkMode
                                ? "bg-slate-800 text-gray-200"
                                : "bg-gray-50 text-gray-700"
                        }`}
                    >
                        <tr>
                            <th className="px-6 py-3 text-center font-medium tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-center font-medium tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-center font-medium tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-center font-medium tracking-wider">
                                Status
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="ml-2 p-1 rounded border text-sm"
                                >
                                    <option value="" className="bg-slate-800">
                                        All
                                    </option>
                                    {statuses.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                            className="bg-slate-800"
                                        >
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-6 py-3 text-center font-medium tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        className={`divide-y ${
                            darkMode ? "divide-slate-700" : "divide-gray-200"
                        }`}
                    >
                        {paginatedResidents.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`${
                                    index % 2 === 0
                                        ? darkMode
                                            ? "bg-slate-800"
                                            : "bg-white"
                                        : darkMode
                                        ? "bg-slate-900"
                                        : "bg-gray-50"
                                } hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors`}
                            >
                                <td className="px-6 py-3 font-medium text-center text-gray-900 dark:text-gray-100">
                                    {user.name}
                                </td>
                                <td className="px-6 py-3 text-gray-600 text-center dark:text-gray-300 truncate max-w-xs">
                                    {user.email}
                                </td>
                                <td className="px-6 py-3 capitalize text-center dark:text-gray-300">
                                    {user.role}
                                </td>
                                <td
                                    className={`px-6 py-3 text-center font-semibold ${
                                        user.status === "active"
                                            ? "text-green-600 dark:text-green-400"
                                            : user.status === "inactive"
                                            ? "text-yellow-600 dark:text-yellow-400"
                                            : "text-red-600 dark:text-red-400"
                                    }`}
                                >
                                    {user.status}
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/resident/details/${user.id}`
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md font-semibold transition-colors"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-4">
                    {/* Prev */}
                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border text-sm font-semibold dark:text-white bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                        Prev
                    </button>

                    {/* Page Numbers */}
                    {(() => {
                        const pages = [];
                        let start = Math.max(1, currentPage - 1);
                        let end = Math.min(totalPages, start + 2);

                        if (end - start < 2) start = Math.max(1, end - 2);

                        if (start > 1) {
                            pages.push(
                                <button
                                    key={1}
                                    onClick={() => setCurrentPage(1)}
                                    className="px-3 py-1 rounded-lg text-sm font-semibold border bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                                >
                                    1
                                </button>
                            );
                            if (start > 2)
                                pages.push(
                                    <span
                                        key="start-ellipsis"
                                        className="text-gray-500 dark:text-gray-400"
                                    >
                                        ...
                                    </span>
                                );
                        }

                        for (let i = start; i <= end; i++) {
                            pages.push(
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
                                        currentPage === i
                                            ? "bg-green-500 text-white border-green-500"
                                            : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                                    }`}
                                >
                                    {i}
                                </button>
                            );
                        }

                        if (end < totalPages) {
                            if (end < totalPages - 1)
                                pages.push(
                                    <span
                                        key="end-ellipsis"
                                        className="text-gray-500 dark:text-gray-400"
                                    >
                                        ...
                                    </span>
                                );
                            pages.push(
                                <button
                                    key={totalPages}
                                    onClick={() => setCurrentPage(totalPages)}
                                    className="px-3 py-1 rounded-lg text-sm font-semibold border bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                                >
                                    {totalPages}
                                </button>
                            );
                        }

                        return pages;
                    })()}

                    {/* Next */}
                    <button
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border text-sm font-semibold dark:text-white bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                        Next
                    </button>
                </div>
            )}
        </motion.div>
    );
};

export default ResidentsTable;
