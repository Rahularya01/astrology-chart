import { BirthChartForm } from "@/components/birth-chart-form";
import React from "react";

const BirthChartGenerator: React.FC = () => {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <BirthChartForm />
    </div>
  );
};

export default BirthChartGenerator;
