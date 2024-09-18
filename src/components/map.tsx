"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { env } from "~/env";

const greenIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 2.12 1.57 4.51 4.1 7.59.48.51 1.11.85 1.9.85s1.42-.34 1.9-.85C17.43 13.51 19 11.12 19 9c0-3.87-3.13-7-7-7zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#00FF00"/></svg>',
    ),
  iconSize: [24, 24], // Size of the icon
  iconAnchor: [12, 24], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -24], // Point from which the popup should open relative to the iconAnchor
});
const MapComponent = () => {
  const center: [number, number] = [24.85898853164005, -90.78569202255129];
  const [aisData, setAisData] = useState([]);

  const { lastMessage, readyState } = useWebSocket(`${env.NEXT_PUBLIC_WS}`);
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const newData = JSON.parse(lastMessage.data);
        // @ts-expect-error trust me
        setAisData((prevData) =>
          [...prevData, newData].filter((item, index, self) => {
            return index === self.findIndex((t) => t.MMSI === item.MMSI);
          }),
        ); // Keep last 10 messages
      } catch (error) {
        // If parsing fails, treat the data as a string

        // @ts-expect-error trust me
        setAisData((prevData) => [...prevData, lastMessage.data]);
      }
    }
  }, [lastMessage]);
  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "max(50vh, 300px)", width: "max(50vw, 300px)" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {aisData.length > 1 &&
        aisData[aisData.length - 1] != "Connected to AIS stream!" &&
        aisData.map((data, index) => {
          if (data != "Connected to AIS stream!" && index > 0) {
            return (
              <Marker
                key={index}
                //ts-ignore
                position={[data.Latitude, data.Longitude]}
                icon={greenIcon}
              >
                <Popup>MMSI: {data.MMSI}</Popup>
              </Marker>
            );
          }
        })}
    </MapContainer>
  );
};

export default MapComponent;
