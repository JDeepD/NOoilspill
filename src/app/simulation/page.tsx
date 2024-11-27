"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";

// Dynamically import components from react-leaflet to disable SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false },
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false },
);

interface Point {
  coords: [number, number];
  timestamp: string;
  COG: string; // Course Over Ground
  SOG: string; // Speed Over Ground
  vesselName: string; // Vessel Name
  vesselTypeName: string;
}

interface Trajectory {
  data: Point[];
  color: string;
}

const ShipTrajectory = () => {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [hoveredData, setHoveredData] = useState<Point | null>(null);

  const vesselTypeMapping: { [key: number]: string } = {
    31: "Tow Ship",
    32: "Tow Ship",
    52: "Tow Ship",
    1023: "Tow Ship",
    1025: "Tow Ship",
    60: "Passenger Ships",
    61: "Passenger Ships",
    62: "Passenger Ships",
    63: "Passenger Ships",
    64: "Passenger Ships",
    65: "Passenger Ships",
    66: "Passenger Ships",
    67: "Passenger Ships",
    68: "Passenger Ships",
    69: "Passenger Ships",
    70: "Cargo Ships",
    71: "Cargo Ships",
    72: "Cargo Ships",
    73: "Cargo Ships",
    74: "Cargo Ships",
    75: "Cargo Ships",
    76: "Cargo Ships",
    77: "Cargo Ships",
    78: "Cargo Ships",
    79: "Cargo Ships",
    80: "Tanker",
    81: "Tanker",
    82: "Tanker",
    83: "Tanker",
    84: "Tanker",
    85: "Tanker",
    86: "Tanker",
    87: "Tanker",
    88: "Tanker",
    89: "Tanker",
  };

  useEffect(() => {
    const fetchCsvData = async (csvFile: string, color: string) => {
      const response = await fetch(csvFile);
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const points: Point[] = results.data
            .map((row: any) => {
              const lat = parseFloat(row.LAT);
              const lon = parseFloat(row.LON);
              const vesselType = parseInt(row.VesselType);
              if (!isNaN(lat) && !isNaN(lon)) {
                return {
                  coords: [lat, lon],
                  timestamp: row.BaseDateTime,
                  COG: row.COG,
                  SOG: row.SOG,
                  vesselName: row.VesselName,
                  vesselTypeName: vesselTypeMapping[vesselType] || vesselType,
                };
              }
              return null;
            })
            .filter((point): point is Point => point !== null);

          if (points.length > 0) {
            setTrajectories((prev) => [...prev, { data: points, color }]);
          }
        },
      });
    };

    const loadAllCsvs = async () => {
      const csvFiles = [
        "/GalvestonGenesisRiver2019/VoyagerTow-GalvestonBay-10-05-2019.csv",
        "/GalvestonGenesisRiver2019/BWOAK.csv",
      ];

      csvFiles.forEach((file, index) => {
        const color = index % 2 === 0 ? "blue" : "red";
        fetchCsvData(file, color);
      });
    };

    loadAllCsvs();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 items-center justify-center">
        <MapContainer
          center={[29.5, -94.8]}
          zoom={10}
          style={{ height: "calc(100vh - 30rem)", width: "70%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {trajectories.map(
            (trajectory, index) =>
              trajectory.data &&
              trajectory.data.length > 0 && (
                <Polyline
                  key={index}
                  positions={trajectory.data.map((point) => point.coords)}
                  color={trajectory.color}
                  eventHandlers={{
                    mousemove: (e) => {
                      const { latlng } = e;
                      const closestPoint = trajectory.data.reduce(
                        (prev, curr) => {
                          const prevDist = Math.sqrt(
                            Math.pow(latlng.lat - prev.coords[0], 2) +
                              Math.pow(latlng.lng - prev.coords[1], 2),
                          );
                          const currDist = Math.sqrt(
                            Math.pow(latlng.lat - curr.coords[0], 2) +
                              Math.pow(latlng.lng - curr.coords[1], 2),
                          );
                          return currDist < prevDist ? curr : prev;
                        },
                      );
                      setHoveredData(closestPoint);
                    },
                    mouseout: () => setHoveredData(null),
                  }}
                >
                  {hoveredData && (
                    <Tooltip sticky className="tooltip-info">
                      <div>
                        <strong>Timestamp:</strong> {hoveredData.timestamp}
                      </div>
                      <div>
                        <strong>COG:</strong> {hoveredData.COG}°
                      </div>
                      <div>
                        <strong>SOG:</strong> {hoveredData.SOG} knots
                      </div>
                      <div>
                        <strong>Vessel Name:</strong> {hoveredData.vesselName}
                      </div>
                      <div>
                        <strong>Vessel Type:</strong>{" "}
                        {hoveredData.vesselTypeName}
                      </div>
                    </Tooltip>
                  )}
                </Polyline>
              ),
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ShipTrajectory;
