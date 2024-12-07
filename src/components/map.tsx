"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({
  data,
}: {
  data: {
    mmsi: string;
    aggregated_data: { LastLAT: number; LastLON: number } | null;
  }[];
}) => {
  const center: [number, number] = [24.85898853164005, -90.78569202255129];

  const greenDotIcon = L.divIcon({
    html: `<div style="width: 10px; height: 10px; background-color: green; border-radius: 50%;"></div>`,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "max(50vh, 300px)", width: "max(50vw, 300px)" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {data
        .filter(
          (ship) =>
            ship.aggregated_data &&
            ship.aggregated_data.LastLAT !== undefined &&
            ship.aggregated_data.LastLON !== undefined,
        )
        .map((ship) => (
          <Marker
            key={ship.mmsi}
            position={[
              ship.aggregated_data!.LastLAT,
              ship.aggregated_data!.LastLON,
            ]}
            icon={greenDotIcon}
          >
            <Popup>
              <div>
                <strong>MMSI:</strong> {ship.mmsi}
                <br />
                <strong>Last LAT:</strong> {ship.aggregated_data!.LastLAT}
                <br />
                <strong>Last LON:</strong> {ship.aggregated_data!.LastLON}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default MapComponent;
