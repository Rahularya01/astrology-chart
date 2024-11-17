import React from "react";

export interface Planet {
  name: string; // Planet name
  house: number; // 1 to 12 based on the house the planet is in
  sign: string; // Zodiac sign of the planet
  degrees: number; // Degrees within the sign
}

interface ChartProps {
  data: Planet[];
}

const BirthChart: React.FC<ChartProps> = ({ data }) => {
  // Define house positions as per the provided coordinates
  const housePositions = {
    1: { x: 250, y: 100 },
    2: { x: 120, y: 40 },
    3: { x: 40, y: 130 },
    4: { x: 120, y: 250 },
    5: { x: 40, y: 370 },
    6: { x: 120, y: 440 },
    7: { x: 250, y: 360 },
    8: { x: 370, y: 440 },
    9: { x: 450, y: 370 },
    10: { x: 370, y: 250 },
    11: { x: 440, y: 130 },
    12: { x: 370, y: 40 },
  };

  // Group planets by house
  const planetsByHouse = data.reduce<Record<number, Planet[]>>((acc, planet) => {
    if (!acc[planet.house]) acc[planet.house] = [];
    acc[planet.house].push(planet);
    return acc;
  }, {});

  return (
    <svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Rectangle */}
      <rect x="0" y="0" width="500" height="500" fill="white" stroke="black" />

      {/* Diagonal Lines for Cross */}
      <line x1="0" y1="0" x2="500" y2="500" stroke="black" />
      <line x1="500" y1="0" x2="0" y2="500" stroke="black" />

      {/* Diamond Shape */}
      <polygon
        points="250,0 500,250 250,500 0,250"
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
      {Object.entries(planetsByHouse).map(([house, planets]) => {
        const housePosition = housePositions[Number(house)];
        if (!housePosition) return null;

        return planets.map((planet, index) => (
          <text
            key={`${house}-${index}`}
            x={housePosition.x}
            y={housePosition.y + 20 + index * 14} // Adjust vertical position for each planet
            fontSize={12}
            textAnchor="middle"
            fill="blue"
          >
            {planet.name.slice(0, 2)} {planet.degrees}°
          </text>
        ));
      })}
    </svg>
  );
};

export default BirthChart;
