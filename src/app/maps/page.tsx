"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("~/components/map"), {
  ssr: false,
});

export default function Maps() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mb-8 w-2/3">
        <span>
          Our Interactive Spill Detection Map provides real-time insights into
          potential oil spills detected from vessels. By leveraging advanced AIS
          (Automatic Identification System) data, we offer a comprehensive view
          of maritime activity, allowing you to monitor and respond to oil
          spills effectively.
        </span>
      </div>
      <div className="flex flex-col items-center">
        <div>Cooking 🍜</div>
        <MapComponent />
      </div>
    </div>
  );
}
