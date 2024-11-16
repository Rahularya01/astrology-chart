"use client"
import React, { useState } from "react";

interface BirthDetails {
  date: string;
  time: string;
  location: string;
}

const BirthChartForm: React.FC = () => {
  const [details, setDetails] = useState<BirthDetails>({
    date: "",
    time: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log(details);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <input
        type="date"
        name="date"
        value={details.date}
        onChange={handleChange}
      />
      <input
        type="time"
        name="time"
        value={details.time}
        onChange={handleChange}
      />
      <input
        type="text"
        name="location"
        placeholder="Enter location"
        value={details.location}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Generate Chart</button>
    </form>
  );
};

export default BirthChartForm;

