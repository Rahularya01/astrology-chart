
import { parseISO, differenceInMilliseconds } from "date-fns";
import { Observer, MakeTime, Equator, Body } from "astronomy-engine";


export const calculateJulianDate = (date: string, time: string): number => {
  const isoString = `${date}T${time}`;
  const dateTime = parseISO(isoString);

  const JD_UNIX_EPOCH = 2440587.5;

  const millisecondsSinceEpoch = differenceInMilliseconds(dateTime, new Date(0));
  const julianDate = JD_UNIX_EPOCH + millisecondsSinceEpoch / 86400000;

  return julianDate;
};


const calculatePlanetPosition = (planet: Body, julianDate: number) => {
  // Create an instance of Astronomy.Observer
  const observer = new Observer(0, 0, 0); // Latitude: 0°, Longitude: 0°, Elevation: 0m

  // Convert Julian Date to a Date object
  const time = MakeTime(new Date((julianDate - 2440587.5) * 86400000));

  // Calculate the equatorial coordinates of the planet
  const equatorial = Equator(planet, time, observer, true, true);

  return {
    name: planet,
    rightAscension: equatorial.ra * 15,
    declination: equatorial.dec,
    distance: equatorial.dist,
  };
};

const planets = [
  Body.Sun,
  Body.Moon,
  Body.Mercury,
  Body.Venus,
  Body.Mars,
  Body.Jupiter,
  Body.Saturn
]

export const generateChartData = (date: string, time: string) => {
  const julianDate = calculateJulianDate(date, time);
  const positions = planets.map((planet) =>
    calculatePlanetPosition(planet, julianDate)
  );

  return positions;
};


