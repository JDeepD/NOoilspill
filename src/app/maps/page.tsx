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

    // fetchData();
    // const interval = setInterval(fetchData, 25000); // 25sec

    // return () => clearInterval(interval);
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
            <label className="mr-4 flex items-center text-xl">
              <input
                type="checkbox"
                checked={showAnomalousShips}
                onChange={() => setShowAnomalousShips(!showAnomalousShips)}
                className="mr-2"
              />
              Show Anomalous Ships
            </label>
            <label className="flex items-center text-xl">
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

          <div className="flex w-[90%] gap-2">
            <div className="flex h-[50vh] w-2/5 flex-col gap-2 rounded-md bg-[#CCC9DC] text-xl">
              <span className="mt-4 flex items-center justify-center text-xl">
                Voyage Controller
              </span>
              <div className="flex items-center justify-center gap-2">
                <input
                  className="w-4/6 rounded-md placeholder:text-center"
                  placeholder="Search Vessels"
                ></input>
                <button className="rounded-md border bg-white px-4">🔍</button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <label className="flex items-center justify-center font-medium text-gray-700">
                  Ship Type:
                </label>
                <select
                  id="options"
                  className="w-3/5 rounded border-gray-300 text-lg focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="option1">All Ships</option>
                  <option value="option1">Oil Tankers</option>
                  <option value="option2">Cargo</option>
                  <option value="option3">Passenger</option>
                </select>
              </div>
            </div>

            <MapComponent data={[]} showAnomalies={false} />

            <div className="flex h-[50vh] w-2/5 flex-col gap-2 rounded-md bg-[#CCC9DC]">
              <span className="mt-4 flex items-center justify-center text-xl">
                Voyage Display
              </span>
              <div className="mx-4 flex items-center justify-center gap-4 rounded-md border-2 border-solid border-gray-500 bg-[#F9F3FF] py-2 text-xl">
                <span>Ship Name: </span>
                <span>{"Voyager"}</span>
              </div>

              <div className="mx-4 flex items-center justify-center gap-4 rounded-md border-2 border-solid border-gray-500 bg-[#F9F3FF] py-2 text-xl">
                <span>Ship Type: </span>
                <span>{"Tanker"}</span>
              </div>
              <div className="mx-4 flex items-center justify-center gap-4 rounded-md border-2 border-solid border-gray-500 bg-[#F9F3FF] py-2 text-xl">
                <span>Stall Duration(mins): </span>
                <span>{"Voyager"}</span>
              </div>

              <div className="mx-4 flex items-center justify-center gap-4 rounded-md border-2 border-solid border-gray-500 bg-[#F9F3FF] py-2 text-xl">
                <span>U-Turns: </span>
                <span>{"Voyager"}</span>
              </div>

              <div className="mx-4 flex items-center justify-center gap-4 rounded-md border-2 border-solid border-gray-500 bg-[#F9F3FF] py-2 text-xl">
                <span>Max Speed: </span>
                <span>{"Voyager"}</span>
              </div>

              <div className="mx-4 flex items-center justify-center gap-4 rounded-md border-2 border-solid border-gray-500 bg-[#F9F3FF] py-2 text-xl">
                <span>Anomalous AIS: </span>
                <span>{"Voyager"}</span>
              </div>

              <div className="mx-4 flex items-center justify-center gap-4 rounded-md border-2 border-solid border-gray-500 bg-[#F9F3FF] py-2 text-xl">
                <span>SAR Confirmation: </span>
                <span>{"No"}</span>
              </div>
            </div>
          </div>

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
