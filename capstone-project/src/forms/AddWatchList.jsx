import useAppState from "../store/useAppState";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SuccessAlert from "../components/alerts/SuccessAlert";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateWatchList } from "../functions/WatchListApi";


const AddWatchList = ({ onClose }) => {
    const { darkMode, base_url, token } = useAppState();
    const [isAlertMessageOpen, setIsAlertMessageOpen] = useState(false);
    const qc = useQueryClient();
    const [form, setForm] = useState({
        type: "",
        identifier: "",
        details: "",
        reason: "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setForm((prev) => ({ ...prev, image: files[0] }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const watchListMutation = useMutation({
        mutationFn: CreateWatchList,
        onSuccess: () => {
            setForm({
                type: "",
                identifier: "",
                details: "",
                reason: "",
                image: null,
            });
            qc.invalidateQueries(['watchList']);
            setIsAlertMessageOpen(true);
            setTimeout(() => {
                setIsAlertMessageOpen(false);
                onClose();
            }, 3000);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!token) {
            console.error("Token not found!");
            return;
        }
       watchListMutation.mutate({base_url, token, form});
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 50,
            transition: { duration: 0.3, ease: "easeIn" },
        },
    };

    return (
        <AnimatePresence>
            <motion.div
                className={`fixed inset-0 flex items-center justify-center z-50 ${
                    darkMode ? "bg-white/40" : "bg-black/40"
                }`}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 relative max-h-[100vh] overflow-y-auto scrollbar-hide"
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold"
                    >
                        ×
                    </button>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                        Add WatchList
                    </h2>

                    {/* Form */}
                    <motion.form
                        className="space-y-4"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        {/* Type */}
                        <div className="flex flex-col space-y-2">
                            <label className="dark:text-white font-semibold">
                                WatchList Type:
                            </label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="dark:bg-slate-700 dark:text-white p-2 rounded-md border border-gray-300 dark:border-gray-600"
                            >
                                <option value="">--Select type--</option>
                                <option value="person">Person</option>
                                <option value="vehicle">Vehicle</option>
                            </select>
                        </div>

                        {/* Full Name / Vehicle */}
                        {form.type && (
                            <div className="flex flex-col space-y-2">
                                <label className="dark:text-white font-semibold">
                                    {form.type === "person"
                                        ? "Full Name"
                                        : "Vehicle Model"}
                                    :
                                </label>
                                <input
                                    type="text"
                                    name="identifier"
                                    value={form.identifier}
                                    onChange={handleChange}
                                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white w-full"
                                    placeholder={
                                        form.type === "person"
                                            ? "Enter full name"
                                            : "Enter vehicle model"
                                    }
                                />
                            </div>
                        )}

                        {/* Details */}
                        <div className="flex flex-col space-y-2">
                            <label className="dark:text-white font-semibold">
                                Details:
                            </label>
                            <textarea
                                name="details"
                                value={form.details}
                                onChange={handleChange}
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white w-full"
                                rows={3}
                                placeholder="Enter additional details"
                            />
                        </div>

                        {/* Reason */}
                        <div className="flex flex-col space-y-2">
                            <label className="dark:text-white font-semibold">
                                Reason:
                            </label>
                            <textarea
                                name="reason"
                                value={form.reason}
                                onChange={handleChange}
                                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white w-full"
                                rows={2}
                                placeholder="Why this is added to watchlist"
                            />
                        </div>

                        {/* Image Upload */}
                        {/* Image Upload */}
                        <div className="flex flex-col space-y-2">
                            <label className="dark:text-white font-semibold">
                                Upload Image:
                            </label>

                            {/* Styled Upload Button */}
                            <label className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900 transition-colors">
                                <span className="text-gray-500 dark:text-gray-300">
                                    {form.image
                                        ? "Change Image"
                                        : "Click to upload image"}
                                </span>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                            </label>

                            {/* Preview */}
                            {form.image && (
                                <img
                                    src={URL.createObjectURL(form.image)}
                                    alt="Preview"
                                    className="mt-2 h-32 w-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                                />
                            )}
                        </div>

                        {/* Submit */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={watchListMutation.isPending}
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-300 disabled:opacity-50"
                        >
                            {watchListMutation.isPending ? "Submitting.." : "Submit"}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </motion.div>

            {isAlertMessageOpen && <SuccessAlert />}
        </AnimatePresence>
    );
};

export default AddWatchList;
