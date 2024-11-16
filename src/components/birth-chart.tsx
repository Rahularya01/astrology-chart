import React from "react";

interface Planet {
  name: string; // Planet name
  house: number; // 1 to 12 based on the house the planet is in
  degrees: number; // Degrees within the house
}

interface ChartProps {
  data: Planet[];
}

const BirthChart: React.FC<ChartProps> = ({ data }) => {
  // Map house numbers to their positions based on the SVG design
  const housePositions = {
    1: { x: 320, y: 50 }, // Adjust coordinates as per the SVG
    2: { x: 470, y: 120 },
    3: { x: 550, y: 270 },
    4: { x: 470, y: 420 },
    5: { x: 320, y: 490 },
    6: { x: 170, y: 420 },
    7: { x: 90, y: 270 },
    8: { x: 170, y: 120 },
    9: { x: 320, y: 270 }, // Center diamond
    10: { x: 370, y: 170 },
    11: { x: 470, y: 270 },
    12: { x: 370, y: 370 },
  };

  return (
    <svg
      width="643"
      height="639"
      viewBox="0 0 643 639"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Include your SVG paths and elements here */}
      {/* For brevity, I'm including only the key structural elements */}
      <rect width="638" height="638" transform="translate(1 1)" fill="white" />
      {/* Diagonal Lines */}
      <line x1="1" y1="1" x2="641" y2="638" stroke="black" />
      <line x1="1" y1="638" x2="641" y2="1" stroke="black" />
      {/* Cross Lines */}
      <line x1="1" y1="319" x2="641" y2="319" stroke="black" />
      <line x1="320" y1="1" x2="320" y2="638" stroke="black" />
      {/* Central Diamond */}
      <polygon
        points="320,1 641,319 320,638 1,319"
        stroke="black"
        fill="none"
        strokeWidth="2"
      />

      {/* House Numbers */}
      {Object.entries(housePositions).map(([houseNumber, pos]) => (
        <text
          key={houseNumber}
          x={pos.x}
          y={pos.y}
          fontSize={16}
          textAnchor="middle"
          fill="black"
        >
          {houseNumber}
        </text>
      ))}

      {/* Place Planets */}
      {data.map((planet, index) => {
        const housePosition = housePositions[planet.house];
        if (!housePosition) return null;
        return (
          <text
            key={index}
            x={housePosition.x}
            y={housePosition.y + 20} // Offset below the house number
            fontSize={14}
            textAnchor="middle"
            fill="blue"
          >
            {planet.name} {planet.degrees}°
          </text>
        );
      })}
    </svg>
  );
};

export default BirthChart;
