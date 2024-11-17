export interface Geo {
  lang: number | undefined; // latitude can be undefined based on `cityDetails?.latitude`
  long: number | undefined; // longitude can be undefined based on `cityDetails?.longitude`
  elev: number; // elevation is a required number
}

export interface SearchQuery {
  name: string; // name from `data.name`
  date: string; // formatted as `day-month-year` from `data.day`, `data.month`, `data.year`
  time: string; // formatted as `hour:minute` from `data.timeHour`, `data.timeMinute`
  geo: Geo; // geo object
}
