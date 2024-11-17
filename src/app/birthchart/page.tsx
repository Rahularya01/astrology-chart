import BirthChart, { Planet } from '@/components/birth-chart';
import { searchParamsCache } from '@/lib/searchParams';
import { generateChartData, getZodiacSign } from '@/lib/utils';
import { SearchQuery } from '@/types/common';
import { SearchParams } from 'nuqs/server';
import React from 'react';

type PageProps = {
  searchParams: Promise<SearchParams>; // Next.js 15+: async searchParams prop
};

// Zodiac signs
const zodiacSigns = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

// Get house number
const getHouse = (rightAscension: number): number => {
  return Math.floor(rightAscension / 30) + 1;
};

// Calculate astrological degrees
const getAstrologicalPosition = (rightAscension: number) => {
  const zodiacIndex = Math.floor(rightAscension / 30); // Determine the zodiac sign index
  const degreesInSign = rightAscension % 30; // Degrees within the sign
  return {
    sign: zodiacSigns[zodiacIndex], // Get the sign name
    degrees: degreesInSign.toFixed(2), // Format degrees to 2 decimals
  };
};


const Page = async ({ searchParams }: PageProps) => {
  const { q: query } = await searchParamsCache.parse(searchParams);

  const queryObject = JSON.parse(query) as SearchQuery;

  // Validate and parse date and time
  const parsedDate = new Date(Date.parse(queryObject.date)); // Parse date

  console.log(queryObject);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format in queryObject.date');
  }

  const parsedTime = queryObject.time; // Ensure time is in HH:mm format
  if (!/^\d{2}:\d{2}$/.test(parsedTime)) {
    throw new Error('Invalid time format in queryObject.time');
  }

  // Generate chart data
  const data = generateChartData(parsedDate, parsedTime);

  const zodiacSign = getZodiacSign(parsedDate);

  const chartData: Planet[] = data.map((planet) => {
    const house = getHouse(planet.rightAscension);
    const { sign, degrees } = getAstrologicalPosition(planet.rightAscension);
    return {
      house,
      sign,
      degrees: +degrees,
      name: planet.name,
    };
  });

  return (
    <div className='px-24 py-10 space-y-10'>
      {zodiacSign && <h1 className='text-3xl font-bold'>{zodiacSign}</h1>}
      <BirthChart data={chartData} />
    </div>
  );
};

export default Page;
