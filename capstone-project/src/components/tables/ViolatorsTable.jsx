import useAppState from "../../store/useAppState";
import { useQuery } from "@tanstack/react-query";
import { getViolators } from "../../functions/ReportsApi";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../Search";

const ViolatorsTable = () => {
    const { base_url, token, darkMode } = useAppState();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const {
        data: violators = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["violators"],
        queryFn: () => getViolators({ token, base_url }),
    });

    // --- Pagination state ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(violators.length / itemsPerPage);
    const filterViolators = violators.filter((v) => {
        const searchLower = search.toLowerCase();
        const ageMatch =
            !isNaN(parseFloat(search)) && v.age <= parseFloat(search);

        return (
            v.last_name.toLowerCase().includes(searchLower) ||
            v.first_name.toLowerCase().includes(searchLower) ||
            v?.zone?.zone_name.toLowerCase().includes(searchLower) ||
            ageMatch
        );
    });

   const currentViolators = filterViolators.slice(
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
            className="p-4 ml-0 w-full"
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
                    <motion.thead
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
                        className={darkMode ? "bg-slate-800" : "bg-gray-50"}
                    >
                        <tr>
                            {[
                                "Photo",
                                "Name",
                                "Age",
                                "Address",
                                "Zone",
                                "Action",
                            ].map((header, idx) => (
                                <th
                                    key={idx}
                                    className={`px-4 py-3 w-40 text-center text-xs font-medium uppercase tracking-wider ${
                                        darkMode
                                            ? "text-gray-200"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </motion.thead>

                    {/* --- BODY --- */}
                    {isLoading ? (
                        <div className="text-center text-white font-bold m-2">
                            <h1>Loading..</h1>
                        </div>
                    ) : (
                        <tbody
                            className={darkMode ? "bg-slate-900" : "bg-white"}
                        >
                            {currentViolators.map((violator, index) => (
                                <motion.tr
                                    key={violator.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 200,
                                        damping: 20,
                                        delay: 0.2,
                                    }}
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
                                            src={violator.photo}
                                            alt={violator.first_name}
                                            className="w-12 h-12 rounded-full object-cover border"
                                        />
                                    </td>

                                    {/* Name */}
                                    <td
                                        className={
                                            darkMode
                                                ? "px-4 py-3 text-gray-200 text-center"
                                                : "px-4 py-3 text-gray-700 text-center"
                                        }
                                    >
                                        {violator.first_name}{" "}
                                        {violator.last_name}
                                    </td>

                                    {/* Age */}
                                    <td
                                        className={
                                            darkMode
                                                ? "px-4 py-3 text-gray-200 text-center"
                                                : "px-4 py-3 text-gray-700 text-center"
                                        }
                                    >
                                        {violator.age}
                                    </td>

                                    {/* Address */}
                                    <td
                                        className={
                                            darkMode
                                                ? "px-4 py-3 text-gray-200 text-center"
                                                : "px-4 py-3 text-gray-700 text-center"
                                        }
                                    >
                                        {violator.address}
                                    </td>

                                    {/* Zone */}
                                    <td
                                        className={
                                            darkMode
                                                ? "px-4 py-3 text-gray-200 text-center"
                                                : "px-4 py-3 text-gray-700 text-center"
                                        }
                                    >
                                        {violator.zone?.zone_name}
                                    </td>

                                    {/* Action */}
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/violators-details/${violator.id}`
                                                )
                                            }
                                            className="px-3 py-1 text-xs font-medium bg-green-400 text-white rounded hover:bg-green-500 transition hover:cursor-pointer"
                                        >
                                            View
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    )}
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

export default ViolatorsTable;
