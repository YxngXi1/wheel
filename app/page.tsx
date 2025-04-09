'use client'

import { useState } from "react";
import dynamic from "next/dynamic";
import options from "@/utils/options";

// Dynamically import the Wheel component with SSR disabled
const Wheel = dynamic(() => import("react-custom-roulette").then((mod) => mod.Wheel), { ssr: false });

export default function Home() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [localOptions, setLocalOptions] = useState(options); // Local copy of options

  const data = localOptions.map((option) => ({
    option: option.name,
    style: { backgroundColor: option.rigged ? "#FF5733" : "#33FF57" },
  }));

  const handleSpinClick = () => {
    const riggedOptions = localOptions.filter((option) => option.rigged);

    if (riggedOptions.length === 0) {
      alert("All choices have been selected");
      return;
    }

    const randomIndex = Math.floor(Math.random() * riggedOptions.length);
    const riggedPrizeIndex = localOptions.findIndex(
      (option) => option.name === riggedOptions[randomIndex].name
    );

    setPrizeNumber(riggedPrizeIndex);
    setMustSpin(true);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);

    setLocalOptions((prevOptions) =>
      prevOptions.filter((_, index) => index !== prizeNumber)
    );
  };

  return (
    <>
      <div></div>

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