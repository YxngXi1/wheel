'use client'

import { useState } from "react";
import options from "@/utils/options";
import dynamic from "next/dynamic";

// Dynamically load Wheel only on the client
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

export default function Home() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [localOptions, setLocalOptions] = useState(options); // Local copy of options

  const data = localOptions.map((option) => ({
    option: option.name,
    style: { backgroundColor: option.rigged ? "#FF5733" : "#33FF57" },
  }));

    const handleSpinClick = () => {
    // rigging mechanism investment stuff
    const riggedOptions = localOptions.filter((option) => option.rigged);
  
    // probably won't be used but just a back up
    if (riggedOptions.length === 0) {
      alert("All choices have been selected");
      return;
    }
  
    // js choose a rnadom rigged option like as long as its in the list of riggedoptions it picks one of them
    const randomIndex = Math.floor(Math.random() * riggedOptions.length);
  
    // this is the actual finding and making the rigged option the rigged option
    const riggedPrizeIndex = localOptions.findIndex(
      (option) => option.name === riggedOptions[randomIndex].name
    );
  
    setPrizeNumber(riggedPrizeIndex);
    setMustSpin(true);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);

    // Remove the guessed option
    setLocalOptions((prevOptions) =>
      prevOptions.filter((_, index) => index !== prizeNumber)
    );
  };

  return (
    <>
      {/* POPUP STUFF */}
      <div></div>

      {/* MAIN PART */}
      <main>
        <h2>Wheel of Fortune</h2>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={handleStopSpinning}
        />
        <button onClick={handleSpinClick} disabled={localOptions.length === 0}>
          Spin the Wheel
        </button>
        {localOptions.length === 0 && <p>All options have been guessed!</p>}
      </main>
    </>
  );
}