import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="mt-8 flex min-h-screen flex-col items-center justify-center bg-white px-2 text-black">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-start">
          <span className="bold text-8xl font-bold">In July 2020,</span>
          <span className="bold mt-2 text-7xl">MV Wakashio</span>
          <span className="bold text-md font-light">
            A Bulk Carrier, reportedly carrying 4000 metric tonnes of oil
          </span>
          <span className="bold mt-3 text-2xl">
            accidently struct the{" "}
            <span className="font-semibold text-[#56426C]">
              coral reefs of Mauritius.
            </span>
          </span>
          <span className="mt-8 text-2xl lg:text-4xl">
            <span className="font-extrabold">In mid-August,</span>
            <br />
            <span className="font-normal">the ship broke in half.</span>
          </span>
          <span className="mt-8 text-lg font-bold lg:text-2xl">
            By that time, it had leaked an estimated
            <br />
            <span className="m-0 text-5xl text-orange-500">
              1000 tonnes{" "}
              <span className="text-lg text-black">of oil into the ocean.</span>
            </span>
          </span>
          <span className="mt-6 text-lg font-bold lg:text-3xl">
            <span className="text-md font-normal">In the subsequent days,</span>
            <br />
            <span>dead sea mammals washed up</span>
            <br />
            <span>on local beaches</span>
            <br />
            <span className="text-sm font-normal">
              and many more found severely ill.
            </span>
          </span>
        </div>
        <Link href={"/maps"}>
          <Button
            variant={"outline"}
            className="mb-14 mt-8 border border-orange-500 text-lg text-black"
          >
            Protect Our Oceans
          </Button>
        </Link>
      </div>
    </main>
  );
}
