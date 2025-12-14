// WatchListDetails.jsx
import React, { useEffect, useState } from "react";
import useAppState from "../../store/useAppState";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWatchListDetails, updateStatus } from "../../functions/WatchListApi";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Map, { Marker, Source, Layer, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import IgpitGeoFence from "../../assets/geomap/igpityoungsville.json";
import SuccessAlert from "../alerts/SuccessAlert";

const WatchListDetails = () => {
    const { darkMode, token, base_url, map_token, map_styles } = useAppState();
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAlertMessageOpen, setIsAlertMessageOpen] = useState(false);
    const qc = useQueryClient();
    const [viewPort, setViewPort] = useState({
        latitude: 8.5107242,
        longitude: 124.5851259,
        zoom: 15,
        bearing: 0,
        pitch: 0,
    });

    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["watchList_details", id],
        queryFn: () => getWatchListDetails({ base_url, token, id }),
        // keepPreviousData: true,
    });

    const mutation = useMutation({
        mutationFn: () => updateStatus({ base_url, token, id}),
        onSuccess: () => {
            qc.invalidateQueries(['watchList_details']);
            setIsAlertMessageOpen(true);
            setTimeout(() => {
                setIsAlertMessageOpen(false);
                onClose();
            }, 3000);
        }
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        mutation.mutate();
    }
    // center to first sighting if exists
    useEffect(() => {
        if (data?.sighting_reports?.length > 0) {
            const first = data.sighting_reports[0];
            setViewPort((prev) => ({
                ...prev,
                latitude: Number(first.latitude),
                longitude: Number(first.longitude),
                zoom: 16,
            }));
        }
    }, [data]);

    if (isLoading)
        return (
            <div className="mt-20 text-gray-500 dark:text-gray-400 text-center">
                <p className="font-bold text-2xl animate-pulse">Loading...</p>
            </div>
        );

    if (isError || !data)
        return (
            <p className="mt-10 text-center text-lg text-gray-500 dark:text-gray-400">
                No record found.
            </p>
        );

    // helper to format date nicely
    const fmt = (iso) =>
        new Date(iso).toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    return (
        <motion.div
            layout
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="px-4 md:px-6 py-2 space-y-6"
        >
            {/* Inline CSS for marker animation + popup glass effect */}
            <style>{`
        .pulse-marker {
          width: 18px;
          height: 18px;
          position: relative;
          transform: translate(-9px, -9px); /* center the marker */
        }
        .pulse-marker .dot {
          width: 100%;
          height: 100%;
          background: #dc2626;
          border-radius: 9999px;
          border: 3px solid white;
          box-shadow: 0 6px 18px rgba(220,38,38,0.3);
          position: relative;
          z-index: 2;
        }
        .pulse-marker .ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 18px;
          height: 18px;
          margin-left: -9px;
          margin-top: -9px;
          border-radius: 9999px;
          background: rgba(220,38,38,0.25);
          animation: pulse 1.6s infinite;
          z-index: 1;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(2.2); opacity: 0.35; }
          100% { transform: scale(1); opacity: 0; }
        }

        .popup-card {
          min-width: 240px;
          max-width: 320px;
          border-radius: 12px;
          padding: 12px;
          background: linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,245,245,0.95));
          box-shadow: 0 8px 30px rgba(2,6,23,0.35);
          color: #0f172a;
        }
        .popup-card.dark {
          background: linear-gradient(180deg, rgba(17,24,39,0.9), rgba(10,15,25,0.85));
          color: #e6eef8;
        }
        .popup-header {
          display:flex;
          gap:10px;
          align-items:center;
        }
        .avatar {
          width:42px;
          height:42px;
          border-radius:8px;
          object-fit:cover;
          border:2px solid rgba(255,255,255,0.8);
        }
        .btn-small {
          padding:6px 10px;
          border-radius:8px;
          font-weight:600;
          font-size:13px;
        }
      `}</style>

            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4">
                    <div className="px-3 py-2 rounded-2xl bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/10">
                        <h2 className="text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight">
                            WATCH-LIST PROFILE
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-700 dark:text-white hover:opacity-95"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* MAIN: Profile (left) + Map (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: Profile + Timeline */}
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 flex gap-4">
                        <div className="flex-shrink-0">
                            <img
                                src={data.image}
                                alt={data.identifier}
                                className="w-28 h-28 rounded-lg object-cover border-4 border-red-600 dark:border-red-400 shadow-md"
                            />
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                        {data.identifier}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase">
                                        {data.type}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <div
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                            data.status === "active"
                                                ? "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                                : "bg-green-800 text-white/60 dark:bg-green-400/40 dark:text-gray-300"
                                        }`}
                                    >
                                        {data.status?.toUpperCase() ?? "N/A"}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                <p>
                                    <span className="font-semibold uppercase text-xs mr-1">
                                        Details:
                                    </span>
                                    {data.details}
                                </p>
                                <p>
                                    <span className="font-semibold uppercase text-xs mr-1">
                                        Reason:
                                    </span>
                                    {data.reason}
                                </p>
                            </div>

                            <div className="mt-auto flex justify-between items-center pt-4">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    <div>
                                        <span className="font-semibold">
                                            Posted:
                                        </span>{" "}
                                        {fmt(data.created_at)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleUpdate}
                                        className="btn-small bg-red-600 text-white rounded-md hover:cursor-pointer hover:bg-red-500"
                                    >
                                        {mutation.isPending
                                            ? "Updating..."
                                            : "Update"}
                                    </button>
                                    <button
                                        onClick={() =>
                                            window.open(
                                                data.image,
                                                "_blank",
                                                "noopener noreferrer"
                                            )
                                        }
                                        className="btn-small border border-gray-200 dark:border-gray-700 dark:text-white/60 bg-white/60 dark:bg-transparent"
                                    >
                                        View Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline (Sightings) */}
                    <div
                        className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-4 space-y-3"
                        style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            scrollbarWidth: "none",
                        }} // <-- add this
                    >
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">
                            Sightings Timeline
                        </h4>

                        <div className="space-y-3">
                            {data.sighting_reports &&
                            data.sighting_reports.length > 0 ? (
                                data.sighting_reports
                                    .slice()
                                    .sort(
                                        (a, b) =>
                                            new Date(b.created_at).getTime() -
                                            new Date(a.created_at).getTime()
                                    )
                                    .map((r) => (
                                        <div key={r.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-red-600" />
                                                <div className="w-[1px] bg-gray-200 h-full mt-1" />
                                            </div>

                                            <div className="flex-1 text-sm">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {r.location}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {fmt(r.created_at)}
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {r.note}
                                                </div>

                                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                    <div className="px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800/40">
                                                        Reporter:{" "}
                                                        {r.user?.name ?? "—"}
                                                    </div>
                                                    <h5 className="px-2 py-1 rounded-md border text-xs">
                                                        {r?.user?.role}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-sm text-gray-500">
                                    No sightings yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Map */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-md">
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                        <div className="px-2 py-1 rounded-md dark:text-white/60 bg-white/80 dark:bg-black/60 text-xs">
                            Legend
                        </div>
                        <div className="px-2 py-1 rounded-md dark:text-white/60 bg-white/70 dark:bg-black/50 text-xs flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-red-600" />
                            Sighting
                        </div>
                        <div className="px-2 py-1 rounded-md dark:text-white/60 bg-white/70 dark:bg-black/50 text-xs flex items-center gap-2">
                            <span className="inline-block w-3 h-1 rounded bg-orange-500/70" />
                            Geofence
                        </div>
                    </div>

                    <div className="w-full h-[520px]">
                        <Map
                            initialViewState={viewPort}
                            onMove={(evt) => setViewPort(evt.viewState)}
                            mapboxAccessToken={map_token}
                            mapStyle={
                                darkMode ? map_styles.dark : map_styles.light
                            }
                            onLoad={(e) => {
                                const mapInstance = e.target;
                                const handleStyleLoad = () => {
                                    setMapLoaded(true);
                                    mapInstance.off("idle", handleStyleLoad);
                                };
                                mapInstance.on("idle", handleStyleLoad);
                            }}
                            style={{ width: "100%", height: "100%" }}
                        >
                            {/* Geofence source + layer */}
                            {mapLoaded && (
                                <Source
                                    id="igpit"
                                    type="geojson"
                                    data={IgpitGeoFence}
                                >
                                    <Layer
                                        id="igpit-fill"
                                        type="fill"
                                        paint={{
                                            "fill-color": "#f97316",
                                            "fill-opacity": 0.18,
                                        }}
                                    />
                                    <Layer
                                        id="igpit-line"
                                        type="line"
                                        paint={{
                                            "line-color": "#f97316",
                                            "line-width": 2,
                                        }}
                                    />
                                </Source>
                            )}

                            {/* Markers */}
                            {data.sighting_reports?.map((report) => {
                                const lat = Number(report.latitude);
                                const lng = Number(report.longitude);
                                return (
                                    <Marker
                                        key={report.id}
                                        latitude={lat}
                                        longitude={lng}
                                        anchor="center"
                                    >
                                        <div
                                            className="pulse-marker"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMarker(report);
                                            }}
                                            role="button"
                                            aria-label="Sighting marker"
                                            title={report.location}
                                        >
                                            <div className="ripple" />
                                            <div className="dot" />
                                        </div>
                                    </Marker>
                                );
                            })}

                            {/* Popup */}
                            {selectedMarker && (
                                <Popup
                                    latitude={Number(selectedMarker.latitude)}
                                    longitude={Number(selectedMarker.longitude)}
                                    onClose={() => setSelectedMarker(null)}
                                    closeOnClick={false}
                                    offset={16}
                                >
                                    <div
                                        className={`popup-card ${
                                            darkMode ? "dark" : ""
                                        }`}
                                        // allow clicking inside
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="popup-header">
                                            <img
                                                src={
                                                    // try to show reporter identification if exists, else fallback to generated avatar
                                                    selectedMarker.user
                                                        ?.identification
                                                        ? `${base_url}/storage/${selectedMarker.user.identification}`
                                                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                              selectedMarker
                                                                  .user?.name ||
                                                                  "Reporter"
                                                          )}&background=ef4444&color=fff`
                                                }
                                                alt={selectedMarker.user?.name}
                                                className="avatar"
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div
                                                    style={{ fontWeight: 700 }}
                                                >
                                                    {selectedMarker.location}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        opacity: 0.8,
                                                    }}
                                                >
                                                    {selectedMarker.user
                                                        ?.name ||
                                                        "Unknown reporter"}
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    marginLeft: 8,
                                                    textAlign: "right",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {fmt(
                                                        selectedMarker.created_at
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                marginTop: 8,
                                                fontSize: 13,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    marginBottom: 8,
                                                    color: darkMode
                                                        ? "#cbd5e1"
                                                        : "#334155",
                                                }}
                                            >
                                                {selectedMarker.note}
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <button
                                                    onClick={() => {
                                                        // center and zoom slightly
                                                        setViewPort((p) => ({
                                                            ...p,
                                                            latitude: Number(
                                                                selectedMarker.latitude
                                                            ),
                                                            longitude: Number(
                                                                selectedMarker.longitude
                                                            ),
                                                            zoom: 17,
                                                        }));
                                                    }}
                                                    className="btn-small bg-red-600 text-white"
                                                >
                                                    Zoom to
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Popup>
                            )}
                        </Map>
                    </div>
                </div>
                {isAlertMessageOpen && <SuccessAlert />}
            </div>
        </motion.div>
    );
};

export default WatchListDetails;
