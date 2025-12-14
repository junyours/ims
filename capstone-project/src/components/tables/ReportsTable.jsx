import { useQuery } from "@tanstack/react-query";
import { getCategories, getReports } from "../../functions/ReportsApi";
import useAppState from "../../store/useAppState";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import useZones from "../../hooks/useZones";
import { useNavigate } from "react-router-dom";
import Search from "../Search";

const ReportTable = () => {
    const { base_url, token, setCategories, darkMode, setReports } =
        useAppState();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedZone, setSelectedZone] = useState("all");
    const [selectedIncidentType, setSelectedIncidentType] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedTime, setSelectedTime] = useState("all");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedQuarter, setSelectedQuarter] = useState("all");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const { data: reports, isLoading } = useQuery({
        queryKey: ["reports"],
        queryFn: () => getReports({ base_url, token }),
        onSuccess: (data) => setReports(data),
    });

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories({ base_url, token }),
        onSuccess: (data) => setCategories(data),
    });

    const { data: zones } = useZones();

    useEffect(() => {
        if (reports && categories) {
            setReports(reports);
            setCategories(categories);
        }
    }, [reports, categories]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 6;

    // ✅ Extract available years dynamically from report dates
    const availableYears = useMemo(() => {
        if (!reports || reports.length === 0) return [];
        const years = reports.map((r) =>
            new Date(r.date || r.created_at).getFullYear()
        );
        return [...new Set(years)].sort((a, b) => b - a);
    }, [reports]);

    const getTimeFrame = (time) => {
        if (!time) return "";
        const hour = parseInt(time.split(":")[0], 10);
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 21) return "evening";
        return "night";
    };

    // ✅ Quarterly mapping
    const quarters = {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12],
    };

    const allMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const displayedMonths =
        selectedQuarter === "all"
            ? allMonths
            : allMonths.filter((_, i) =>
                  quarters[selectedQuarter].includes(i + 1)
              );

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setSelectedIncidentType("all");
        setCurrentPage(1);
    };

    // ✅ Filtering logic
    const filteredReports =
        reports?.filter((report) => {
            const reportDate = new Date(report?.date || report?.created_at);
            const reportMonth = reportDate.getMonth() + 1;
            const reportYear = reportDate.getFullYear();

            const categoryMatch =
                selectedCategory === "all" ||
                report?.incident_type?.category?.id ===
                    parseInt(selectedCategory);

            const incidentMatch =
                selectedIncidentType === "all" ||
                report?.incident_type?.id === parseInt(selectedIncidentType);

            const monthMatch =
                selectedMonth === "all" ||
                reportMonth === parseInt(selectedMonth);

            const timeFrameMatch =
                selectedTime === "all" ||
                getTimeFrame(report?.time) === selectedTime;

            const zoneMatch =
                selectedZone === "all" ||
                report?.location?.zone?.id === parseInt(selectedZone);

            const yearMatch =
                selectedYear === "" || reportYear === parseInt(selectedYear);

            // ✅ Quarterly filtering within selected year
            const quarterMatch =
                selectedQuarter === "all" ||
                (selectedYear !== "" &&
                    reportYear === parseInt(selectedYear) &&
                    quarters[selectedQuarter].includes(reportMonth));

            const searchLower = search.toLowerCase();
            const searchMatch =
                report?.incident_type?.category?.category_name
                    ?.toLowerCase()
                    .includes(searchLower) ||
                report?.incident_type?.incident_name
                    ?.toLowerCase()
                    .includes(searchLower) ||
                report?.location?.zone?.zone_name
                    ?.toLowerCase()
                    .includes(searchLower) ||
                report?.location?.location_name
                    ?.toLowerCase()
                    .includes(searchLower) ||
                report?.user?.name?.toLowerCase().includes(searchLower);

            return (
                categoryMatch &&
                incidentMatch &&
                monthMatch &&
                timeFrameMatch &&
                zoneMatch &&
                yearMatch &&
                quarterMatch &&
                searchMatch
            );
        }) || [];

    // Pagination logic
    const totalReports = filteredReports.length;
    const totalPages = Math.ceil(totalReports / reportsPerPage);
    const startIndex = (currentPage - 1) * reportsPerPage;
    const currentReports = filteredReports.slice(
        startIndex,
        startIndex + reportsPerPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [
        selectedCategory,
        selectedIncidentType,
        selectedMonth,
        selectedTime,
        selectedZone,
        selectedYear,
        selectedQuarter,
    ]);

    return (
        <>
            {/* ✅ Year & Quarter Filter Section */}
            <div className="w-full mb-4">
                <Search search={search} setSearch={setSearch} />
                <div className="flex gap-2 mt-2 ml-2">
                    {/* Year Dropdown */}
                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setSelectedQuarter("all");
                        }}
                        className={`p-2 rounded text-sm ${
                            darkMode ? "bg-slate-700 text-gray-200" : "bg-white"
                        }`}
                    >
                        <option value="">All Years</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    {/* Quarter Dropdown — only visible when year selected */}
                    {selectedYear && (
                        <select
                            value={selectedQuarter}
                            onChange={(e) => setSelectedQuarter(e.target.value)}
                            className={`p-2 rounded text-sm ${
                                darkMode
                                    ? "bg-slate-700 text-gray-200"
                                    : "bg-white"
                            }`}
                        >
                            <option value="all">All Quarters</option>
                            <option value="1">Q1 (Jan–Mar)</option>
                            <option value="2">Q2 (Apr–Jun)</option>
                            <option value="3">Q3 (Jul–Sep)</option>
                            <option value="4">Q4 (Oct–Dec)</option>
                        </select>
                    )}
                </div>
            </div>

            {/* ✅ Table */}
            <motion.div className="p-1">
                <div
                    className={`overflow-x-auto rounded-lg shadow ${
                        darkMode ? "bg-slate-900" : "bg-white"
                    }`}
                >
                    <table
                        className={`min-w-full divide-y text-sm ${
                            darkMode ? "divide-slate-700" : "divide-gray-200"
                        }`}
                    >
                        <motion.thead
                            layout
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                            }}
                            className={darkMode ? "bg-slate-800" : "bg-gray-50"}
                        >
                            <tr>
                                {[
                                    "Category",
                                    "Incident",
                                    "Month",
                                    "Time Frame",
                                ].map((header, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                            darkMode
                                                ? "text-gray-200"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {header === "Category" && (
                                            <select
                                                className={`w-full p-2 rounded text-sm ${
                                                    darkMode
                                                        ? "bg-slate-700 text-gray-200"
                                                        : "bg-white"
                                                }`}
                                                value={selectedCategory}
                                                onChange={handleCategoryChange}
                                            >
                                                <option value="all">
                                                    Category
                                                </option>
                                                {categories?.map((cat) => (
                                                    <option
                                                        key={cat.id}
                                                        value={cat.id}
                                                    >
                                                        {cat.category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                        {header === "Incident" && (
                                            <select
                                                className={`w-full p-2 rounded text-sm ${
                                                    darkMode
                                                        ? "bg-slate-700 text-gray-200"
                                                        : "bg-white"
                                                }`}
                                                value={selectedIncidentType}
                                                onChange={(e) =>
                                                    setSelectedIncidentType(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="all">
                                                    Incident
                                                </option>
                                                {categories
                                                    ?.find(
                                                        (cat) =>
                                                            selectedCategory ===
                                                                "all" ||
                                                            cat.id ===
                                                                parseInt(
                                                                    selectedCategory
                                                                )
                                                    )
                                                    ?.incident_types?.map(
                                                        (type) => (
                                                            <option
                                                                key={type.id}
                                                                value={type.id}
                                                            >
                                                                {
                                                                    type.incident_name
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                            </select>
                                        )}
                                        {header === "Month" && (
                                            <select
                                                className={`w-full p-2 rounded text-sm ${
                                                    darkMode
                                                        ? "bg-slate-700 text-gray-200"
                                                        : "bg-white"
                                                }`}
                                                value={selectedMonth}
                                                onChange={(e) =>
                                                    setSelectedMonth(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="all">
                                                    Month
                                                </option>
                                                {displayedMonths.map(
                                                    (month, index) => {
                                                        const actualIndex =
                                                            allMonths.indexOf(
                                                                month
                                                            );
                                                        return (
                                                            <option
                                                                key={month}
                                                                value={
                                                                    actualIndex +
                                                                    1
                                                                }
                                                            >
                                                                {month}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                            </select>
                                        )}
                                        {header === "Time Frame" && (
                                            <select
                                                className={`w-full p-2 rounded text-sm ${
                                                    darkMode
                                                        ? "bg-slate-700 text-gray-200"
                                                        : "bg-white"
                                                }`}
                                                value={selectedTime}
                                                onChange={(e) =>
                                                    setSelectedTime(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="all">
                                                    Time
                                                </option>
                                                <option value="morning">
                                                    Morning (5AM–12PM)
                                                </option>
                                                <option value="afternoon">
                                                    Afternoon (12PM–5PM)
                                                </option>
                                                <option value="evening">
                                                    Evening (5PM–9PM)
                                                </option>
                                                <option value="night">
                                                    Night (9PM–5AM)
                                                </option>
                                            </select>
                                        )}
                                    </th>
                                ))}
                                <th
                                    className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                        darkMode
                                            ? "text-gray-200"
                                            : "text-gray-600"
                                    }`}
                                >
                                    <select
                                        className={`w-full p-2 rounded text-sm ${
                                            darkMode
                                                ? "bg-slate-700 text-gray-200"
                                                : "bg-white"
                                        }`}
                                        value={selectedZone}
                                        onChange={(e) =>
                                            setSelectedZone(e.target.value)
                                        }
                                    >
                                        <option value="all">Zones</option>
                                        {zones?.map((zone) => (
                                            <option
                                                key={zone.id}
                                                value={zone.id}
                                            >
                                                {zone.zone_name}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-200">
                                    Location
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-200">
                                    Filed By
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-200">
                                    Action
                                </th>
                            </tr>
                        </motion.thead>

                        {isLoading ? (
                            <tbody>
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-6 text-gray-400 font-semibold"
                                    >
                                        Loading reports...
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {currentReports.map((report, index) => (
                                    <motion.tr
                                        key={report.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 200,
                                            damping: 20,
                                        }}
                                        className={`${
                                            index % 2 === 0
                                                ? darkMode
                                                    ? "bg-slate-800"
                                                    : "bg-white"
                                                : darkMode
                                                ? "bg-slate-900"
                                                : "bg-gray-50"
                                        }`}
                                    >
                                        <td className="px-4 py-3 text-gray-200">
                                            {
                                                report?.incident_type?.category
                                                    ?.category_name
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-gray-200">
                                            {
                                                report?.incident_type
                                                    ?.incident_name
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-gray-200">
                                            {report?.date}
                                        </td>
                                        <td className="px-4 py-3 text-gray-200 text-center">
                                            {new Date(
                                                `1970-01-01T${report?.time}`
                                            ).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-gray-200">
                                            {report?.location?.zone?.zone_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-200">
                                            {report?.location?.location_name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-200">
                                            {report?.user?.name}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/report-details/${report.id}`
                                                    )
                                                }
                                                className="px-3 py-1 text-xs font-medium bg-green-400 text-white rounded hover:bg-green-500 transition"
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

                {/* ✅ Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 py-6">
                        <button
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg border text-sm font-semibold bg-green-500 text-white hover:bg-green-400 disabled:opacity-50 transition-all"
                        >
                            Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded-lg text-sm font-semibold border transition-colors ${
                                    currentPage === i + 1
                                        ? "bg-green-500 text-white border-green-500"
                                        : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg border text-sm font-semibold bg-green-500 text-white hover:bg-green-400 disabled:opacity-50 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default ReportTable;
