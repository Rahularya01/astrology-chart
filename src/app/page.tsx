"use client"
import BirthChart from "@/components/birth-chart";
import React, { useState } from "react";

const BirthChartGenerator: React.FC = () => {
  const [chartData, setChartData] = useState([
    { name: "Sun", house: 1, degrees: 10 },
    { name: "Moon", house: 2, degrees: 15 },
    { name: "Mars", house: 3, degrees: 20 },
    { name: "Mercury", house: 4, degrees: 25 },
    { name: "Venus", house: 5, degrees: 5 },
    { name: "Jupiter", house: 6, degrees: 12 },
    { name: "Saturn", house: 7, degrees: 18 },
    { name: "Rahu", house: 8, degrees: 9 },
    { name: "Ketu", house: 9, degrees: 3 },
  ]);

  return (
    <div>
      <h1>Vedic Birth Chart</h1>
      <BirthChart data={chartData} />
    </div>
  );
};

export default BirthChartGenerator;
