import { motion } from "framer-motion";
import useAppState from "../store/useAppState";
import { IoAddCircleOutline } from "react-icons/io5";
import AddWatchList from "../forms/AddWatchList";
import WatchListTable from "../components/tables/WatchListTable";
import { useState } from "react";
const WatchList = () => {
    const { open } = useAppState();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div >
            <div
                className={`flex flex-col flex-1 ${
                    open ? "ml-0" : "ml-0"
                } transition-all duration-300`}
            >
                <div className="flex justify-between m-2 items-center">
                    <motion.h1
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="dark:text-white text-gray-700 font-medium text-2xl mt-2 ml-6"
                    >
                        WatchList
                    </motion.h1>
                    <button
                        className="bg-green-500 p-2 rounded-lg flex text-gray-200 items-center text-md font-bold dark:text-white hover:cursor-pointer hover:bg-green-400"
                        onClick={() => setModalOpen(true)}
                    >
                        <IoAddCircleOutline size={30} />
                        Watch-List
                    </button>
                </div>
            </div>
            {modalOpen && <AddWatchList onClose={()=> setModalOpen(false)}/>}
            <div>
                <WatchListTable/>
            </div>
        </div>
    );
};
export default WatchList;
