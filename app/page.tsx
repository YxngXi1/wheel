'use client'

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import options from "@/utils/options";
import dynamic from "next/dynamic";

// Dynamically load Wheel only on the client
const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

// Define text size levels
const textSizeLevels: Record<string, number> = {
  small: 12,
  medium: 16,
  normal: 20,
  large: 24,
};

export default function Home() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [localOptions, setLocalOptions] = useState(options); // Local copy of options
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // State for the selected option
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  useEffect(() => {
    if (showPopup) {
      // Trigger confetti explosion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
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
          : "#ff95cb", // Alternate in groups of five
    },
    textStyle: {
      fontSize: `18`,
      color: "#FFFFFF",
      textAlign: "center", // Ensure proper alignment
    },
  }));

  const handleSpinClick = () => {
    // Find the option with the lowest "order" property
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

    // Set the selected option to display in the popup
    setSelectedOption(localOptions[prizeNumber]?.name || null);
    setShowPopup(true); // Show the popup

    // Remove the guessed option
    setLocalOptions((prevOptions) =>
      prevOptions.filter((_, index) => index !== prizeNumber)
    );
  };

  const closePopup = () => {
    setShowPopup(false); // Close the popup
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
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2>Selected Option</h2>
              <p>{selectedOption}</p>
              <button
                onClick={closePopup}
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
  
        {/* MAIN PART */}
        <div className="h-[50vh] mx-auto w-full text-center flex justify-center items-center z-10 fixed">
          <div
            className="text-5xl font-bold text-white border bg-[#ffdbdb] rounded-full"
            style={{
              padding: "10px 20px",
              textShadow: "2px 2px 0 #ff19b1, -2px 2px 0 #ff19b1, 2px -2px 0 #ff19b1, -2px -2px 0 #ff19b1", // Black outline
            }}
          >
            <p>{selectedOption || "SELECTING PROMPT.."}</p>
          </div>
        </div>
        <main className="min-h-screen flex justify-center items-end">
          <div
            onClick={handleSpinClick}
            className="mb-20"
            style={{
              cursor: mustSpin ? "default" : "pointer",
              transform: "scale(1.25) translateY(-50px)", // Scale the wheel and move it up by 50px
              transition: "transform 0.3s ease", // Smooth scaling and translation transition
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
    </>
  );
}