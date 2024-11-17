import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Body, Equator, MakeTime, Observer } from "astronomy-engine";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getElevation = async (latitude: number, longitude: number) => {
  const response = await fetch(`https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`);
  const data = await response.json();
  return data.results[0].elevation;
};

export const calculateJulianDate = (date: string, time: string): number => {
  const isoString = `${date}T${time}:00Z`; // Ensure valid UTC format
  const dateTime = new Date(isoString);

  if (isNaN(dateTime.getTime())) {
    throw new Error("Invalid date or time format.");
  }

  const JD_UNIX_EPOCH = 2440587.5; // Julian Date for Unix epoch
  const millisecondsSinceEpoch = dateTime.getTime();
  return JD_UNIX_EPOCH + millisecondsSinceEpoch / 86400000;
};

export const calculatePlanetPosition = (planet: Body, julianDate: number) => {
  const observer = new Observer(0, 0, 0); // Replace with actual latitude, longitude, elevation
  const time = MakeTime(julianDate); // Pass Julian Date directly
  const equatorial = Equator(planet, time, observer, true, true);

  return {
    name: planet,
    rightAscension: equatorial.ra * 15,
    declination: equatorial.dec,
    distance: equatorial.dist,
  };
};

export const generateChartData = (date: Date, time: string) => {
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const julianDate = calculateJulianDate(formattedDate, time);

  const planets = [Body.Sun, Body.Moon, Body.Mercury, Body.Venus, Body.Mars, Body.Jupiter, Body.Saturn];
  return planets.map((planet) => calculatePlanetPosition(planet, julianDate));
};


export const getZodiacSign = (dateOfBirth: Date): string => {
  const birthDate = new Date(dateOfBirth); // Parse the date
  const month = birthDate.getMonth() + 1; // getMonth() is 0-based
  const day = birthDate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return "Aries";
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return "Taurus";
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return "Gemini";
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return "Cancer";
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return "Leo";
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return "Virgo";
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return "Libra";
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return "Scorpio";
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return "Sagittarius";
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return "Capricorn";
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return "Aquarius";
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return "Pisces";
  } else {
    throw new Error("Invalid date of birth");
  }
};


