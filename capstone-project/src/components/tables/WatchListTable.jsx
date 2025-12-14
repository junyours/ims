import useAppState from "../../store/useAppState";
import { useQuery } from "@tanstack/react-query";
import { getWatchList } from "../../functions/WatchListApi";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../Search";

const WatchListTable = () => {
    const { base_url, token, darkMode } = useAppState();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const { data: watchList = [], isLoading } = useQuery({
        queryKey: ["watchList"],
        queryFn: () => getWatchList({ token, base_url }),
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter by identifier or type
    const filteredList = watchList.filter((item) => {
        const searchLower = search.toLowerCase();
        return (
            item.identifier.toLowerCase().includes(searchLower) ||
            item.type.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const currentItems = filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <motion.div
            layout
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.1,
            }}
            className="p-4 w-full"
        >
            <Search search={search} setSearch={setSearch} />

            <div
                className={`overflow-x-auto mt-4 rounded-lg shadow ${
                    darkMode ? "bg-slate-900" : "bg-white"
                }`}
            >
                <table
                    className={`min-w-full mt-2 divide-y text-sm ${
                        darkMode ? "divide-slate-700" : "divide-gray-200"
                    }`}
                >
                    {/* --- HEADERS --- */}
                    <thead className={darkMode ? "bg-slate-800" : "bg-gray-50"}>
                        <tr>
                            {[
                                "Photo",
                                "Identifier",
                                "Type",
                                "Status",
                                "Action",
                            ].map((header, idx) => (
                                <th
                                    key={idx}
                                    className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                                        darkMode
                                            ? "text-gray-200"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* --- BODY --- */}
                    <tbody className={darkMode ? "bg-slate-900" : "bg-white"}>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-4 text-white font-bold"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : currentItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No data found.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className={
                                        index % 2 === 0
                                            ? darkMode
                                                ? "bg-slate-800"
                                                : "bg-white"
                                            : darkMode
                                            ? "bg-slate-900"
                                            : "bg-gray-50"
                                    }
                                >
                                    {/* Photo */}
                                    <td className="px-4 py-3 flex justify-center items-center">
                                        <img
                                            src={item.image}
                                            alt={item.identifier}
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                    </td>

                                    {/* Identifier */}
                                    <td
                                        className={
                                            darkMode
                                                ? "px-4 py-3 text-gray-200 text-center"
                                                : "px-4 py-3 text-gray-700 text-center"
                                        }
                                    >
                                        {item.identifier}
                                    </td>

                                    {/* Type */}
                                    <td
                                        className={
                                            darkMode
                                                ? "px-4 py-3 text-gray-200 text-center"
                                                : "px-4 py-3 text-gray-700 text-center"
                                        }
                                    >
                                        {item.type}
                                    </td>
                                    {/* Reason */}
                                    <td
                                        className={
                                            darkMode
                                                ? "px-4 py-3 text-gray-200 text-center"
                                                : "px-4 py-3 text-gray-700 text-center"
                                        }
                                    >
                                        {item.status}
                                    </td>

                                    {/* Action */}
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/watch-list/details/${item.id}`
                                                )
                                            }
                                            className="px-3 py-1 text-xs font-medium bg-green-400 text-white rounded hover:bg-green-500 transition"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-4">
                    <button
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border text-sm font-semibold dark:text-white bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-700 disabled:opacity-50 transition-all"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
                                    currentPage === page
                                        ? "bg-green-500 text-white border-green-500"
                                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                                }`}
                            >
                                {page}
                            </button>
                        );
                    })}

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

export default WatchListTable;
