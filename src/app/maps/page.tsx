"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import Navbar from "~/components/navbar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useEffect, useState } from "react";

const MapComponent = dynamic(() => import("~/components/map"), {
  ssr: false,
});

interface AggregatedData {
  MaxSpeed: number;
  AvgHeading: number;
  FirstLAT: number;
  FirstLON: number;
  LastLAT: number;
  LastLON: number;
  ProximityToPort: number;
  ProximityToReef: number;
  isTankerOrCargo: number;
  isSpecialManeuver: boolean;
  isAnomalous: number;
}

interface MMSIReports {
  mmsi: string;
  aggregated_data: AggregatedData | null;
}

export default function Maps() {
  const [data, setData] = useState<MMSIReports[]>([]);
  const [showAnomalousShips, setShowAnomalousShips] = useState(false);
  const [showConfirmedOilSpills, setShowConfirmedOilSpills] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sample_ais"));
        const updatedData: MMSIReports[] = snapshot.docs
          .map((doc) => {
            const data = doc.data() as { aggregated_data?: AggregatedData };
            return {
              mmsi: doc.id,
              aggregated_data: data.aggregated_data ?? null,
            };
          })
          .filter(
            (item) =>
              item.aggregated_data &&
              item.aggregated_data.LastLAT !== undefined &&
              item.aggregated_data.LastLON !== undefined,
          ); // Filter out invalid entries
        setData(updatedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleAISAnomalyDetection = () => {
    // Implement the logic for AIS Anomaly Detection
    console.log("Running AIS Anomaly Detection");
  };

  return (
    <div>
      <Navbar />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="mb-8 px-2 lg:w-2/5">
          <span>
            Our Interactive Spill Detection Map provides real-time insights into
            potential oil spills detected from vessels. By leveraging advanced
            AIS (Automatic Identification System) data, we offer a comprehensive
            view of maritime activity, allowing you to monitor and respond to
            oil spills effectively.
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">Gulf of Mexico Region</div>
          <div></div>
          <div className="mt-4">
            <Button
              variant={"outline"}
              className="mr-4 border border-[#CCC9DC] hover:bg-[#CCC9DC] hover:text-[#56426C]"
              onClick={handleAISAnomalyDetection}
            >
              Run AIS Anomaly Detection
            </Button>
          </div>

          <div className="mt-4 flex">
            <label className="mr-4 flex items-center">
              <input
                type="checkbox"
                checked={showAnomalousShips}
                onChange={() => setShowAnomalousShips(!showAnomalousShips)}
                className="mr-2"
              />
              Show Anomalous Ships
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showConfirmedOilSpills}
                onChange={() =>
                  setShowConfirmedOilSpills(!showConfirmedOilSpills)
                }
                className="mr-2"
              />
              Show Confirmed Oil Spills
            </label>
          </div>

          <MapComponent data={data} showAnomalies={showAnomalousShips} />

          <Link href={"/immersive"}>
            <Button
              variant={"outline"}
              className="mt-8 border border-orange-400 hover:bg-orange-500 hover:text-white"
            >
              Immersive Mode
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
