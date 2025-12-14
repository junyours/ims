import { motion } from "framer-motion";
import useAppState from "../store/useAppState";
import { useState } from "react";
import ChangePassword from "../forms/ChangePassword";

const Settings = () => {
    const { open, user } = useAppState();
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);

    return (
        <div
            className={`flex flex-col flex-1 items-center transition-all duration-300 ${
                open ? "ml-0" : "ml-0"
            }`}
        >
            {/* PAGE TITLE */}
            <div className="w-full flex justify-center mt-6">
                <motion.h1
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="dark:text-white text-gray-700 font-semibold text-3xl"
                >
                    Settings
                </motion.h1>
            </div>

            {/* SETTINGS SECTIONS */}
            <div className="mt-8 w-full flex justify-center">
                <div className="space-y-6 w-full max-w-2xl px-6">
                    {/* ACCOUNT SECTION */}
                    <div className="bg-white dark:bg-slate-900 shadow-md rounded-xl p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                            Account Settings
                        </h2>

                        {/* Change Password Row */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-gray-200 dark:border-slate-700">
                            <div className="space-y-1">
                                <p className="font-medium text-gray-700 dark:text-white">
                                    Change Password
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Update your account password
                                </p>
                            </div>
                            <div className="space-y-1 mt-2 md:mt-0 text-left md:text-right">
                                <p className="font-medium text-gray-700 dark:text-white">
                                    Last Updated
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {user?.updated_at
                                        ? new Date(
                                              user.updated_at
                                          ).toLocaleString()
                                        : "Never"}
                                </p>
                            </div>
                            <div className="mt-3 md:mt-0">
                                <button
                                    onClick={() => setIsPasswordOpen(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Placeholder row to add more settings later */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3">
                            <div className="space-y-1">
                                <p className="font-medium text-gray-700 dark:text-white">
                                    Two-Factor Authentication
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Add extra security (Coming soon)
                                </p>
                            </div>
                            <div className="mt-3 md:mt-0">
                                <button className="px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg cursor-not-allowed">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isPasswordOpen && (
                <ChangePassword onClose={() => setIsPasswordOpen(false)} />
            )}
        </div>
    );
};

export default Settings;
