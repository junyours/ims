import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Barangay from "../assets/img/Barangay.png";
import Tanod from "../assets/img/bpat.png";
import OCC from "../assets/img/OCC.jpg"
import Android from "../assets/img/android (1).png"

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, delay } },
});

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full overflow-x-hidden">
            {/* ================= HERO SECTION ================= */}
            <section
                className="relative min-h-screen flex flex-col"
                style={{
                    backgroundImage: `url(${Tanod})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-0"></div>

                {/* Header */}
                <header className="w-full flex items-center justify-between py-4 px-6 relative z-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src={Barangay}
                            className="h-12 w-12 rounded-full shadow-lg"
                        />
                        <h1 className="text-2xl font-bold text-white drop-shadow-md">
                            Barangay Igpit
                        </h1>
                    </div>

                    {/* Nav Items */}
                    <nav className="hidden md:flex items-center gap-8 text-white font-semibold">
                        <button
                            onClick={() => window.scrollTo(0, 0)}
                            className="hover:text-green-400 transition"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => window.scrollTo(0, 600)}
                            className="hover:text-green-400 transition"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => window.scrollTo(0, 1300)}
                            className="hover:text-green-400 transition"
                        >
                            About
                        </button>
                    </nav>

                    {/* Login Button */}
                    <button
                        onClick={() => navigate("/login")}
                        className="hidden md:block bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
                    >
                        Login
                    </button>

                    {/* Mobile Menu */}
                    <div className="md:hidden text-white text-3xl">☰</div>
                </header>

                {/* Hero Content */}
                <motion.div
                    {...fadeIn(0.2)}
                    className="relative z-10 flex flex-col items-center text-center px-6"
                >
                    <img
                        src={Barangay}
                        className="h-48 w-48 rounded-full shadow-xl mb-6"
                    />

                    <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
                        Incident Report & Response Management System
                    </h1>

                    <p className="text-white/80 text-lg md:text-xl mt-4 max-w-3xl">
                        Stay updated. Track incidents. Empower your community
                        efficiently with the Mobile App.
                    </p>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://drive.usercontent.google.com/download?id=1hfeOPRBriFncidtN_pazD05UKT99bsh1&export=download&authuser=0"
                        download="BPAT-App.apk"
                        className="flex items-center mb-6 mt-8 bg-green-800 hover:bg-green-600 text-2xl text-white font-semibold px-12 py-3 rounded-full shadow-xl transition"
                    >
                        <img src={Android} className="w-10 h-10" /> Download App
                    </motion.a>
                </motion.div>
            </section>

            {/* ================= FEATURES ================= */}
            <section className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center px-8 py-20">
                <motion.h2
                    {...fadeIn(0.1)}
                    className="text-4xl md:text-5xl font-bold text-center text-green-700 dark:text-green-500 mb-6"
                >
                    Features
                </motion.h2>

                <motion.p
                    {...fadeIn(0.2)}
                    className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
                >
                    Powerful tools designed for community safety and efficiency.
                </motion.p>

                <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                    <motion.div
                        {...fadeIn(0.3)}
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold text-green-700 dark:text-green-500 mb-3">
                            Real-time Monitoring
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Track and update incidents instantly to ensure fast
                            response times.
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeIn(0.4)}
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold text-green-700 dark:text-green-500 mb-3">
                            Community Watchlist
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Maintain profiles and quickly identify violators to
                            improve safety.
                        </p>
                    </motion.div>

                    <motion.div
                        {...fadeIn(0.5)}
                        className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold text-green-700 dark:text-green-500 mb-3">
                            Dashboard Analytics
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Access insightful charts and statistics to make
                            informed decisions.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ================= ABOUT ================= */}
            <section className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center px-8 py-20">
                <motion.h2
                    {...fadeIn(0.1)}
                    className="text-4xl md:text-5xl font-bold text-center text-green-700 dark:text-green-500 mb-6"
                >
                    About
                </motion.h2>

                <motion.p
                    {...fadeIn(0.2)}
                    className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto text-lg md:text-xl"
                >
                    The Barangay Igpit Incident Report and Response System
                    enhances community safety and streamlines incident
                    reporting. Local responders can monitor incidents in
                    real-time, maintain a watchlist of individuals for security
                    purposes, and access insightful analytics to make informed
                    decisions. The system empowers barangay Responders and
                    residents to work together towards a safer, more organized
                    neighborhood.
                </motion.p>
            </section>

            {/* ================= CTA ================= */}
            <section className="min-h-[60vh] bg-green-800 flex flex-col items-center justify-center text-center px-6 py-16">
                <motion.h2
                    {...fadeIn(0.1)}
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                    Ready to Start?
                </motion.h2>

                <motion.p
                    {...fadeIn(0.2)}
                    className="text-white/80 max-w-2xl mb-8 text-lg md:text-xl"
                >
                    Join thousands of community responders using BPAT to keep
                    neighborhoods safe.
                </motion.p>

                <motion.button
                    {...fadeIn(0.3)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="bg-white hover:bg-gray-100 text-green-700 font-semibold px-12 py-3 rounded-full shadow-xl transition"
                >
                    Login Now
                </motion.button>
                <motion.p
                    {...fadeIn(0.2)}
                    className="flex items-center text-white/80 max-w-2xl mt-10 text-sm md:text-xl gap-2"
                >
                    <img src={OCC} className="h-8 w-8 rounded-lg" />| OCC IT
                    Students 2025
                </motion.p>
            </section>
        </div>
    );
};

export default LandingPage;
