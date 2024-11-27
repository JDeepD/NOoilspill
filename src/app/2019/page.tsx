"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";

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
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false },
);

interface Point {
  coords: [number, number];
  timestamp: string;
  COG: string;
  SOG: string;
  vesselName: string;
  vesselTypeName: string;
}

interface Trajectory {
  data: Point[];
  color: string;
}

const ShipTrajectory = () => {
  const [trajectories, setTrajectories] = useState<Trajectory[]>([]);
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(100);

  const vesselTypeMapping: { [key: number]: string } = {
    // ... (previous mapping remains the same)
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
            .filter((point): point is Point => point !== null)
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
            );

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

      await Promise.all(
        csvFiles.map((file, index) => {
          const color = index % 2 === 0 ? "blue" : "green";
          return fetchCsvData(file, color);
        }),
      );
    };

    loadAllCsvs();
  }, []);

  const startAnimation = () => {
    if (trajectories.length === 0) return;
    setIsAnimating(true);
    setIsPaused(false);
    setAnimationProgress(0);
  };

  const pauseAnimation = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (isAnimating && !isPaused && trajectories.length > 0) {
      const allPoints = trajectories.flatMap((t) => t.data);
      const sortedPoints = allPoints.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      const startTime = new Date(sortedPoints[0]!.timestamp).getTime();
      const endTime = new Date(
        sortedPoints[sortedPoints.length - 1]!.timestamp,
      ).getTime();
      const totalDuration = endTime - startTime;

      const animationInterval = setInterval(() => {
        setAnimationProgress((prev) => {
          if (prev >= 100) {
            setIsAnimating(false);
            return 100;
          }

          const currentTimeStamp = new Date(
            startTime + (prev / 100) * totalDuration,
          );
          setCurrentTime(currentTimeStamp.toLocaleString());

          return prev + 1;
        });
      }, animationSpeed);

      return () => clearInterval(animationInterval);
    }
  }, [isAnimating, isPaused, trajectories, animationSpeed]);

  const accidentAreaCoords: [number, number] = [29.645, -94.965];

  return (
    <div className="flex h-screen flex-col">
      <div className="">
        <div className="mb-5 mt-10 items-center text-center text-4xl">
          Genesis River and Voyager Collision (2019)
        </div>
        <div className="flex flex-1 items-center justify-center">
          <MapContainer
            center={[29.5, -94.8]}
            zoom={10}
            style={{ height: "calc(100vh - 30rem)", width: "70%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Circle
              center={accidentAreaCoords}
              radius={3000}
              color="red"
              fillColor="red"
              fillOpacity={0.3}
            />

            {trajectories.map((trajectory, index) => (
              <Polyline
                key={index}
                positions={trajectory.data
                  .filter((point) => {
                    const pointTime = new Date(point.timestamp).getTime();
                    const startTime = new Date(
                      trajectory.data[0]!.timestamp,
                    ).getTime();
                    const endTime = new Date(
                      trajectory.data[trajectory.data.length - 1]!.timestamp,
                    ).getTime();
                    const totalDuration = endTime - startTime;
                    const progress =
                      ((pointTime - startTime) / totalDuration) * 100;
                    return progress <= animationProgress;
                  })
                  .map((point) => point.coords)}
                color={trajectory.color}
              />
            ))}
          </MapContainer>
        </div>
        <div className="mt-10 flex flex-col items-center space-y-4 text-center text-2xl">
          {currentTime && (
            <div className="text-xl">Current Time: {currentTime}</div>
          )}
          <div className="space-x-4">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isAnimating ? "Animating..." : "Start Animation"}
            </button>
            {isAnimating && (
              <button
                onClick={pauseAnimation}
                className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
            )}
            <a
              target="_blank"
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              href="https://www.ntsb.gov/investigations/AccidentReports/Reports/MAR2101.pdf"
            >
              Incident Report 🔗
            </a>
          </div>
          <div>
            <label htmlFor="speed-control" className="mr-2">
              Animation Speed:
            </label>
            <input
              id="speed-control"
              type="range"
              min="50"
              max="500"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="w-64"
            />
            <span className="ml-2">{animationSpeed} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipTrajectory;
