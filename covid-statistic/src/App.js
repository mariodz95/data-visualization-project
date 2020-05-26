import React from "react";
import "./App.css";
import * as d3 from "d3";
import { drawMap } from "./drawMap";
import Select from "react-select";
import LineChartData from "./LineChartData";

const options = [
  { value: "croCases", label: "Hrvatska slučajevi" },
  { value: "croDeaths", label: "Hrvatska umrli" },
  { value: "croCured", label: "Hrvatska izliječeni" },
  { value: "worldCases", label: "Svijet slučajevi" },
  { value: "worldDeaths", label: "Svijet umrli" },
  { value: "worldCured", label: "Svijet izliječeni" },
];

class App extends React.Component {
  state = {
    lastData: null,
    dataByState: [],
    covidStatus: [],
    lineGraphData: [],
    covidDataByPerson: [],
    selectedOption: null,
    test: {},
  };

  componentDidMount() {
    fetch("https://www.koronavirus.hr/json/?action=podaci_zadnji")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ lastData: data });
      });

    fetch("https://www.koronavirus.hr/json/?action=po_danima_zupanijama_zadnji")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        for (let i = 0; i < data[0].PodaciDetaljno.length; i++) {
          this.state.dataByState.push(data[0].PodaciDetaljno[i]);
        }
        drawMap(this.state.dataByState);
      });

    fetch("https://www.koronavirus.hr/json/?action=podaci")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ covidStatus: data });
        console.log("data", data);
        for (let i = 0; i < this.state.covidStatus.length; i++) {
          let covidCase = new LineChartData();

          covidCase.croCases = this.state.covidStatus[i].SlucajeviHrvatska;
          covidCase.date = this.state.covidStatus[i].Datum;
          covidCase.croCured = this.state.covidStatus[i].IzlijeceniHrvatska;
          covidCase.croDeaths = this.state.covidStatus[i].UmrliHrvatska;

          covidCase.worldCases = this.state.covidStatus[i].SlucajeviSvijet;
          covidCase.worldCured = this.state.covidStatus[i].IzlijeceniSvijet;
          covidCase.worldDeaths = this.state.covidStatus[i].UmrliSvijet;
          this.state.lineGraphData.push(covidCase);
        }
        this.setState({ selectedOption: options[0] });
        console.log("this", this.state.lineGraphData);
        this.lineChart(this.state.selectedOption);
      });

    fetch("https://www.koronavirus.hr/json/?action=po_osobama")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ covidDataByPerson: data });
        const todayDate = new Date().getFullYear();
        let covidCase = new PieData();
        let male = 0;
        let female = 0;
        let years;
        let young = 0;
        let oldMedium = 0;
        let youngMedium = 0;
        let old = 0;
        for (let i = 0; i < this.state.covidDataByPerson.length; i++) {
          years = todayDate - this.state.covidDataByPerson[i].dob;
          if (years >= 0 && years <= 18) {
            young++;
          } else if (years > 18 && years <= 35) {
            youngMedium++;
          } else if (years > 35 && years <= 65) {
            oldMedium++;
          } else {
            old++;
          }

          if (this.state.covidDataByPerson[i].spol === "M") {
            male++;
          } else {
            female++;
          }
        }
        covidCase.young = young;
        covidCase.youngMedium = youngMedium;
        covidCase.oldMedium = oldMedium;
        covidCase.old = old;
        this.setState({ test: covidCase });
        this.drawPieChart();
      });
  }

  lineChart = (data) => {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 100 },
      width = 1100 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3
      .line()
      .x(function (d) {
        return x(new Date(d.date));
      })
      .y(function (d) {
        if (data.value === "croCases") {
          return y(d.croCases);
        } else if (data.value === "croDeaths") {
          return y(d.croDeaths);
        } else if (data.value === "croCured") {
          return y(d.croCured);
        } else if (data.value === "worldCases") {
          return y(d.worldCases);
        } else if (data.value === "worldDeaths") {
          return y(d.worldDeaths);
        } else if (data.value === "worldCured") {
          return y(d.worldCured);
        }
      });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("body")
      .select(".lineChart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(
      d3.extent(this.state.lineGraphData, function (d) {
        return new Date(d.date);
      })
    );
    y.domain([
      0,
      d3.max(this.state.lineGraphData, function (d) {
        if (data.value === "croCases") {
          return d.croCases;
        } else if (data.value === "croDeaths") {
          return d.croDeaths;
        } else if (data.value === "croCured") {
          return d.croCured;
        } else if (data.value === "worldCases") {
          return d.worldCases;
        } else if (data.value === "worldDeaths") {
          return d.worldDeaths;
        } else if (data.value === "worldCured") {
          return d.worldCured;
        }
      }),
    ]);
    // Add the valueline path.
    svg
      .append("path")
      .data([this.state.lineGraphData])
      .attr("class", "line")
      .attr("d", valueline);

    // 12. Appends a circle for each datapoint
    svg
      .selectAll(".dot")
      .data(this.state.lineGraphData)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function (d, i) {
        return x(i);
      })
      .attr("cy", function (d) {
        return y(d.y);
      })
      .attr("r", 5)
      .on("mouseover", function (a, b, c) {
        console.log(a);
        this.attr("class", "focus");
      })
      .on("mouseout", function () {});

    // Add the X Axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g").attr("class", "y axis").call(d3.axisLeft(y));
  };

  // ** Update data section (Called from the onclick)
  updateData = (data) => {
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the line
    var valueline = d3
      .line()
      .x(function (d) {
        return x(new Date(d.date));
      })
      .y(function (d) {
        if (data.value === "croCases") {
          return y(d.croCases);
        } else if (data.value === "croDeaths") {
          return y(d.croDeaths);
        } else if (data.value === "croCured") {
          return y(d.croCured);
        } else if (data.value === "worldCases") {
          return y(d.worldCases);
        } else if (data.value === "worldDeaths") {
          return y(d.worldDeaths);
        } else if (data.value === "worldCured") {
          return y(d.worldCured);
        }
      });
    // Scale the range of the data again
    x.domain(
      d3.extent(this.state.lineGraphData, function (d) {
        return new Date(d.date);
      })
    );
    y.domain([
      0,
      d3.max(this.state.lineGraphData, function (d) {
        if (data.value === "croCases") {
          return d.croCases;
        } else if (data.value === "croDeaths") {
          return d.croDeaths;
        } else if (data.value === "croCured") {
          return d.croCured;
        } else if (data.value === "worldCases") {
          return d.worldCases;
        } else if (data.value === "worldDeaths") {
          return d.worldDeaths;
        } else if (data.value === "worldCured") {
          return d.worldCured;
        }
      }),
    ]);

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    // Make the changes
    svg
      .select(".line") // change the line
      .duration(750)
      .attr("d", valueline(this.state.lineGraphData));
    svg
      .select(".x.axis") // change the x axis
      .duration(750)
      .call(d3.axisBottom(x));
    svg
      .select(".y.axis") // change the y axis
      .duration(750)
      .call(d3.axisLeft(y));
  };

  // drawBarChart() {
  //   var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //   var width = 500;
  //   var height = 500;
  //   var svg = d3
  //     .select("body")
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height);
  //   var barchart = svg
  //     .selectAll("rect")
  //     .data(this.state.casesInCroatia)
  //     .enter()
  //     .append("rect")
  //     .attr("x", function (d, i) {
  //       return 50 * i;
  //     })
  //     .attr("y", function (d) {
  //       return height - d * 50;
  //     })
  //     .attr("width", 40)
  //     .attr("height", function (d) {
  //       return d * 50;
  //     })
  //     .attr("fill", "blue");
  //   var width = 500;
  //   var height = 500;

  //   var svg = d3
  //     .select("body")
  //     .append("svg")
  //     .attr("width", width)
  //     .attr("height", height);
  // }

  drawPieChart() {
    // set the dimensions and margins of the graph

    var width = 450;
    var height = 450;
    var margin = 40;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin;

    // append the svg object to the div called 'my_dataviz'
    var svg = d3
      .select("body")
      .select(".pieChart")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create dummy data
    var data = this.state.test;

    // set the color scale
    var color = d3
      .scaleOrdinal()
      .domain(data)
      .range(["#FF8C00", "#1E90FF", "#228B22", "#4B0082", "#800000"]);

    // Compute the position of each group on the pie:
    var pie = d3.pie().value(function (d) {
      return d.value;
    });
    var data_ready = pie(d3.entries(data));

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("whatever")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
      .attr("fill", function (d) {
        return color(d.data.key);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    var legend = svg
      .selectAll(".legend-entry")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend-entry");

    legend
      .append("rect")
      .attr("class", "legend-rect")
      .attr("x", 0)
      .attr("y", function (d, i) {
        return i * 20;
      })
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", function (d) {
        return color(data);
      });

    legend
      .append("text")
      .attr("class", "legend-text")
      .attr("x", 25)
      .attr("y", function (d, i) {
        return i * 20;
      })
      .text(function (d) {
        return data;
      });
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.updateData(selectedOption);
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <React.Fragment>
        <h1>Covid-19 Statistic</h1>
        {this.state.lastData !== null
          ? this.state.lastData.map((item) => (
              <React.Fragment>
                <h3 key={item.Datum}>Last update: {item.Datum}</h3>
                <table>
                  <tbody>
                    <tr>
                      <td>Infected in Croatia: {item.SlucajeviHrvatska}</td>
                      <td>Deaths in Croatia {item.UmrliHrvatska}</td>
                      <td>Recovered in Croatia {item.IzlijeceniHrvatska}</td>
                    </tr>
                    <tr>
                      <td>Infected in world: {item.SlucajeviSvijet}</td>
                      <td>Deaths in world: {item.UmrliSvijet}</td>
                      <td>Recovered in world: {item.IzlijeceniSvijet}</td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ))
          : "No data"}

        <svg className="map"></svg>
        <br />
        <div className="select">
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />
        </div>
        <svg className="lineChart"></svg>
        <br />
        <svg className="pieChart"></svg>
      </React.Fragment>
    );
  }
}

class PieData {
  constructor(young, youngMedium, oldMedium, old) {
    this.young = young;
    this.youngMedium = youngMedium;
    this.oldMedium = oldMedium;
    this.old = old;
  }
}

class DataByState {
  constructor(state, infected, deaths) {
    this.state = state;
    this.infected = infected;
    this.deaths = deaths;
  }
}

export default App;
