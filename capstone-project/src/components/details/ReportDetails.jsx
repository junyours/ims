import useAppState from "../../store/useAppState";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ReportViolators from "./ReportViolators";
import { useQuery } from "@tanstack/react-query";
import { reportDetails } from "../../functions/ReportsApi";

const ReportDetails = () => {
    const { id } = useParams();
    const { darkMode, token, base_url } = useAppState();
    const navigate = useNavigate();

    const {
        data: report,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["report_details", id],
        queryFn: () => reportDetails({ token, base_url, id }),
    });

    if (isLoading)
        return (
            <div className="flex justify-center items-center mt-20 text-gray-500 dark:text-gray-300">
                <p className="font-bold text-2xl animate-pulse">Loading...</p>
            </div>
        );
    if (isError || !report)
        return (
            <p className="text-center mt-10 text-lg text-gray-500 dark:text-gray-400">
                No report found.
            </p>
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
            className="px-4 md:px-8 py-6 space-y-6 max-w-5xl mx-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Report Details
                </h2>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-400 transition-colors font-semibold text-white"
                >
                    Back
                </button>
            </div>

            {/* Reporter Info */}
            <motion.div
                layout
                className={`flex flex-col md:flex-row justify-between bg-white/30 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700`}
            >
                <div className="space-y-2">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                        Reported By: {report?.user?.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Role: {report?.user?.role}
                    </p>
                </div>
                <div className="space-y-2 mt-3 md:mt-0 text-gray-700 dark:text-gray-300">
                    <p>Date: {report?.date}</p>
                    <p>
                        Time:{" "}
                        {new Date(
                            `1970-01-01T${report?.time}`
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </p>
                </div>
            </motion.div>

            {/* Response Info */}
            {report?.response_record && (
                <motion.div
                    layout
                    className="flex flex-col md:flex-row justify-between bg-white/30 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700"
                >
                    <div className="space-y-2 text-gray-800 dark:text-gray-200">
                        <p className="font-semibold">
                            Requested By:{" "}
                            {report.response_record.request.user.name}
                        </p>
                        <p>Distance: {report.response_record.distance} km</p>
                        <p>
                            Response Time:{" "}
                            {report.response_record.response_time}{" "}
                            {report.response_record.response_time > 59
                                ? "hours"
                                : "minutes"}
                        </p>
                    </div>
                    <div className="space-y-2 mt-3 md:mt-0 text-gray-700 dark:text-gray-300">
                        <p>
                            Request Date:{" "}
                            {new Date(
                                report.response_record.created_at
                            ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                        <p>
                            Request Time:{" "}
                            {new Date(
                                report.response_record.created_at
                            ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Incident Info */}
            <motion.div
                layout
                className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
            >
                <h3 className="text-xl font-semibold border-b pb-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    Incident Information
                </h3>
                <div className="flex flex-col md:flex-row justify-between text-gray-700 dark:text-gray-300">
                    <p>
                        <span className="font-semibold">Category:</span>{" "}
                        {report?.incident_type?.category?.category_name}
                    </p>
                    <p>
                        <span className="font-semibold">Type:</span>{" "}
                        {report?.incident_type?.incident_name}
                    </p>
                </div>
                <div>
                    <p className="font-semibold mb-2 dark:text-white">Report Description:</p>
                    <p className="p-4 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 shadow-sm">
                        {report?.report_description}
                    </p>
                </div>
            </motion.div>

            {/* Location */}
            <motion.div
                layout
                className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
            >
                <h3 className="text-xl font-semibold border-b pb-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    Location
                </h3>
                <div className="flex flex-col md:flex-row justify-between text-gray-700 dark:text-gray-300">
                    <p>
                        <span className="font-semibold">Zone:</span>{" "}
                        {report?.location?.zone?.zone_name}
                    </p>
                    <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {report?.location?.location_name}
                    </p>
                </div>
                <div>
                    <p className="font-semibold mb-2 dark:text-white">Landmark:</p>
                    {report?.location?.landmark ? (
                        <img
                            src={report.location.landmark}
                            alt="landmark"
                            className="w-full max-w-md h-64 object-cover rounded-xl border shadow-sm border-gray-300 dark:border-slate-600"
                        />
                    ) : (
                        <p className="italic text-gray-500 dark:text-gray-400">
                            No landmark provided
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Violators */}
            <ReportViolators reportId={id} />

            {/* Evidences */}
            <motion.div
                layout
                className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
            >
                <h3 className="text-xl font-semibold border-b pb-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
                    Evidences
                </h3>
                {report.evidences?.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                        {report.evidences.map((evidence, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center p-3 rounded-xl shadow-sm bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600"
                            >
                                <img
                                    src={evidence.file_url}
                                    alt={`evidence-${index}`}
                                    className="w-40 h-40 object-cover rounded-md mb-2"
                                />
                                <p className="text-sm text-center text-gray-700 dark:text-gray-300">
                                    {evidence?.remarks}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="italic text-gray-500 dark:text-gray-400">
                        No evidences available
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ReportDetails;
