function pad3(number) {
  if (number < 10) {
    return "00" + number;
  }
  if (number < 100) {
    return "0" + number;
  }
  return number;
}

const now = new Date();
const year = now.getFullYear();
const yearStart = new Date(year, 0);
const yearEnd = new Date(year + 1, 0);
const yearMS = yearEnd.getTime() - yearStart.getTime();
const fracMS = now.getTime() - yearStart.getTime();
const frac = Math.floor((fracMS * 1000) / yearMS);
const yearNum = year % 1000;
const m = Math.floor(year / 1000);
const checkNum = 0;

console.log(`version: "${checkNum}${pad3(frac)}${pad3(yearNum)}.M${m}"`);
