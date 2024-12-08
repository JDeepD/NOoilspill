"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({
  data,
  showAnomalies,
}: {
  data: {
    mmsi: string;
    aggregated_data: {
      LastLAT: number;
      LastLON: number;
      isAnomalous: number;
    } | null;
  }[];
  showAnomalies: boolean;
}) => {
  const center: [number, number] = [24.85898853164005, -90.78569202255129];

  // Green marker icon for normal ships
  const greenDotIcon = L.divIcon({
    html: `<div style="width: 8px; height: 8px; background-color: green; border-radius: 50%;"></div>`,
    className: "",
    iconSize: [15, 15],
    iconAnchor: [7, 7],
  });

  // Red marker icon for anomalous ships
  const redDotIcon = L.divIcon({
    html: `<div style="width: 8px; height: 8px; background-color: red; border-radius: 50%;"></div>`,
    className: "",
    iconSize: [15, 15],
    iconAnchor: [7, 7],
  });

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "max(50vh, 300px)", width: "max(90vw, 300px)" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data
        .filter(
          (ship) =>
            ship.aggregated_data &&
            ship.aggregated_data.LastLAT !== undefined &&
            ship.aggregated_data.LastLON !== undefined,
        )
        .map((ship) => {
          // Select the appropriate icon based on the isAnomalous field
          let icon = showAnomalies
            ? ship.aggregated_data!.isAnomalous === 1
              ? redDotIcon
              : greenDotIcon
            : greenDotIcon;

          return (
            <Marker
              key={ship.mmsi}
              position={[
                ship.aggregated_data!.LastLAT,
                ship.aggregated_data!.LastLON,
              ]}
              icon={icon}
            >
              <Popup>
                <div>
                  <strong>MMSI:</strong> {ship.mmsi}
                  <br />
                  <strong>Last LAT:</strong> {ship.aggregated_data!.LastLAT}
                  <br />
                  <strong>Last LON:</strong> {ship.aggregated_data!.LastLON}
                  <br />
                  <strong>Is Anomalous:</strong>{" "}
                  {ship.aggregated_data!.isAnomalous === 1 ? "Yes" : "No"}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default MapComponent;
