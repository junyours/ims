import { useEffect, useState } from "react";
import useAppState from "../../store/useAppState";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../functions/CategoryApi";
import "mapbox-gl/dist/mapbox-gl.css";
import useZones from "../../hooks/useZones";
import useLocations from "../../hooks/useLocations";
import ZoneList from "./ZoneList";
import { motion, AnimatePresence } from "framer-motion";
import { IoLocationSharp } from "react-icons/io5";
import ZoneDetails from "./ZoneDetails";
import LocationDetails from "../details/LocationDetails";
import IgpitGeoFence from "../../assets/geomap/igpityoungsville.json"
import '../../index.css'

const ReactMap = () => {
    const { map_token, darkMode, map_styles, open, base_url, token } =
        useAppState();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [selectedZone, setSelectedZone] = useState(null);
    const [viewPort, setViewPort] = useState({
        latitude: 8.5107242,
        longitude: 124.5851259,
        zoom: 14,
    });

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedIncidentId, setSelectedIncidentId] = useState("");
    const [hoveredZoneId, setHoveredZoneId] = useState(null);
    const { data: zones = [], isLoading, isError } = useZones();
    const { data: locations = [] } = useLocations();
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories({ base_url, token }),
    });

    const selectedCategory = categories.find(
        (cat) => cat.id === Number(selectedCategoryId)
    );

    // zoom into selected zone
    useEffect(() => {
        if (selectedZone) {
            setViewPort((prev) => ({
                ...prev,
                latitude: selectedZone.latitude,
                longitude: selectedZone.longitude,
                zoom: 16,
                transitionDuration: 800,
            }));
        }
    }, [selectedZone]);

    useEffect(() => {
        if (selectedLocation) {
            setSelectedZone(null);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (selectedZone) {
            setSelectedLocation(null);
        }
    }, [selectedZone]);

    // Filter locations based on selected category and incident
    const filteredLocations = Array.isArray(locations)
        ? locations.filter((loc) => {
              // Skip locations without reports
              if (!loc.reports || loc.reports.length === 0) return false;

              // Check if any report matches the selected filters
              return loc.reports.some((report) => {
                  const categoryMatch = selectedCategoryId
                      ? report.incident_type.category_id ===
                        Number(selectedCategoryId)
                      : true;

                  const incidentMatch = selectedIncidentId
                      ? report.incident_type_id === Number(selectedIncidentId)
                      : true;

                  return categoryMatch && incidentMatch;
              });
          })
        : [];

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-h-full flex"
        >
            {isLoading && <div>Loading map zones...</div>}
            {isError && <div>Failed to load zones.</div>}
            {/* zone details */}
            <AnimatePresence>
                {selectedZone && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute z-50 dark:border-slate-700 ${
                            open ? "top-15 left-60" : "top-15 left-20"
                        }`}
                    >
                        <ZoneDetails
                            zone={selectedZone}
                            onClose={() => setSelectedZone(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* location details */}
            <AnimatePresence>
                {selectedLocation && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute z-50 dark:border-slate-700 ${
                            open ? "top-15 left-60" : "top-15 left-20"
                        }`}
                    >
                        <LocationDetails
                            locationId={selectedLocation}
                            onClose={() => setSelectedLocation(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* mapbox incident heatmap */}
            <div className="flex-1 relative">
                <div className="absolute top-2 right-0 z-9999 flex gap-2">
                    {/* Category Selector */}
                    <div className="dark:bg-slate-800 bg-white/80 p-2 rounded">
                        <select
                            name="category"
                            value={selectedCategoryId}
                            onChange={(e) => {
                                const newCategory = e.target.value;
                                setSelectedCategoryId(newCategory);
                                setSelectedIncidentId("");
                            }}
                            className="dark:bg-slate-700 bg-white/90 dark:text-white px-2 py-1 rounded"
                        >
                            <option value="">--Select Category--</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Incident Selector */}
                    <div className="dark:bg-slate-800 bg-white/90 p-2 rounded">
                        <select
                            name="incident"
                            value={selectedIncidentId}
                            onChange={(e) =>
                                setSelectedIncidentId(e.target.value)
                            }
                            className="dark:bg-slate-700 bg-white/90 dark:text-white px-2 py-1 rounded"
                            disabled={
                                !selectedCategoryId && selectedCategoryId !== ""
                            }
                        >
                            <option value="">--Select Incident--</option>
                            {selectedCategory?.incident_types?.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.incident_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <Map
                    {...viewPort}
                    onMove={(evt) => setViewPort(evt.viewState)}
                    mapboxAccessToken={map_token}
                    mapStyle={darkMode ? map_styles.dark : map_styles.light}
                    style={{ width: "100%", height: "100%" }}
                    onLoad={(e) => {
                        const mapInstance = e.target;

                        // Wait until the map style and layers are fully ready
                        const handleStyleLoad = () => {
                            console.log("✅ Map style fully loaded!");
                            setMapLoaded(true);
                            mapInstance.off("idle", handleStyleLoad); // cleanup listener
                        };

                        // 'idle' event ensures the style, tiles, and sources are all ready
                        mapInstance.on("idle", handleStyleLoad);
                    }}
                >
                    {mapLoaded && (
                        <Source id="igpit" type="geojson" data={IgpitGeoFence}>
                            <Layer
                                id="igpit-fill"
                                source="igpit"
                                type="fill"
                                paint={{
                                    "fill-color": "#f97316",
                                    "fill-opacity": 0.25,
                                }}
                            />
                            <Layer
                                id="igpit-outline"
                                source="igpit"
                                type="line"
                                paint={{
                                    "line-color": "#f97316",
                                    "line-width": 2,
                                }}
                            />
                        </Source>
                    )}

                    {/* Locations */}
                    {filteredLocations.length > 0 ? (
                        filteredLocations.map((loc) => (
                            <Marker
                                key={loc.id}
                                longitude={Number(loc.longitude)}
                                latitude={Number(loc.latitude)}
                                onClick={() => setSelectedLocation(loc.id)}
                                anchor="bottom"
                            >
                                <div className="relative cursor-pointer">
                                    <div className="pulse-red"></div>
                                </div>
                            </Marker>
                        ))
                    ) : (
                        <></>
                    )}

                    {/* Zones */}
                    {zones.map((zone) => (
                        <Marker
                            key={zone.id}
                            longitude={zone.longitude}
                            latitude={zone.latitude}
                            anchor="bottom"
                        >
                            <div
                                onMouseEnter={() => setHoveredZoneId(zone.id)}
                                onMouseLeave={() => setHoveredZoneId(null)}
                                style={{
                                    position: "relative",
                                    cursor: "pointer",
                                }}
                            ></div>
                        </Marker>
                    ))}
                </Map>
            </div>

            {/* zone list */}
            <div className="w-[280px] bg-slate-100 dark:bg-slate-900 p-3 overflow-y-auto hide-scrollbar">
                <ZoneList setSelectedZone={setSelectedZone} />
            </div>
        </motion.div>
    );
};

export default ReactMap;
