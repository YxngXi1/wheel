'use client'

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import options from "@/utils/options";
import dynamic from "next/dynamic";

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

export default function Home() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [localOptions, setLocalOptions] = useState(options); 
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    if (showPopup) {
      // confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        zIndex: 1100, 
      });
    }
  }, [showPopup]);

  const data = localOptions.map((option, index) => ({
    option: option.name,
    style: {
      backgroundColor:
        index % 5 === 0
          ? "#ffdbdb"
          : index % 5 === 1
          ? "#dde7b5"
          : index % 5 === 2
          ? "#ffdbdb"
          : index % 5 === 3
          ? "#b9b7be"
          : "#ff95cb", 
    },
    textStyle: {
      fontSize: `18`,
      color: "#FFFFFF",
      textAlign: "center", 
    },
  }));

  const handleSpinClick = () => {
    // go from 1,2,3
    const orderedOptions = localOptions.filter((option) => option.order !== undefined);
    if (orderedOptions.length === 0) {
      alert("All choices have been selected");
      return;
    }

    const lowestOrderOption = orderedOptions.reduce((prev, curr) =>
      prev.order < curr.order ? prev : curr
    );

    const prizeIndex = localOptions.findIndex((option) => option.id === lowestOrderOption.id);

    setPrizeNumber(prizeIndex);
    setMustSpin(true);
  };

  const handleStopSpinning = () => {
    setMustSpin(false);

    setSelectedOption(localOptions[prizeNumber]?.name || null);
    setShowPopup(true); 

    setLocalOptions((prevOptions) =>
      prevOptions.filter((_, index) => index !== prizeNumber)
    );
  };

  const closePopup = () => {
    setShowPopup(false); 
  };

  return (
    <>
      <div className="image-background-1 min-h-screen">
        {/* POPUP */}
        {showPopup && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#dd9494",
                border: "10px solid #c7f874",
                padding: "100px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <div className="mb-20">
                <h2 className="heading-font text-6xl text-white">Selected Option</h2>
                <p className="text-8xl font-semibold text-white">[{selectedOption}]</p>
              </div>
              <button
                onClick={closePopup}
                style={{
                  marginTop: "50px",
                  padding: "10px 20px",
                  backgroundColor: "#afd46e",
                  border: "none",
                  borderRadius: "999px",
                  cursor: "pointer",
                }}
              >
                <p className="text-black text-2xl">ok purr</p>
              </button>
            </div>
          </div>
        )}
      
        {/* MAIN PART */}
        <div className="p-20">‎ </div>
        <div className="w-full text-center flex items-justify items-center flex-col mt-20">
          <div
            className="w-1/2 text-5xl font-bold text-white border bg-[#ffdbdb] rounded-full mt-10"
            style={{
              padding: "10px 20px",
              textShadow: "2px 2px 0 #ff19b1, -2px 2px 0 #ff19b1, 2px -2px 0 #ff19b1, -2px -2px 0 #ff19b1",
            }}
          >
            <p>{selectedOption || "SELECTING PROMPT.."}</p>
          </div>
          <main className="w-full flex justify-center items-start mt-10">
            <div
              onClick={handleSpinClick}
              className="mb-20"
              style={{
                cursor: mustSpin ? "default" : "pointer",
                transition: "transform 0.3s ease",
              }}
            >
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={handleStopSpinning}
                fontSize={17.5}
                innerBorderWidth={0}
                radiusLineWidth={0}
                outerBorderWidth={1}
              />
            </div>
            {localOptions.length === 0 && <p>All options have been guessed!</p>}
          </main>
        </div>
      </div>
    </>
  );
}