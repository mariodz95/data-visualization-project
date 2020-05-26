export default class LineChartData {
  constructor(
    croCases,
    date,
    croDeaths,
    croCured,
    worldCases,
    worldDeaths,
    worldCured
  ) {
    this.croCases = croCases;
    this.croDeaths = croDeaths;
    this.croCured = croCured;
    this.date = date;
    this.worldCases = worldCases;
    this.worldDeaths = worldDeaths;
    this.worldCured = worldCured;
  }
}
