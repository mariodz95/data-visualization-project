import React from "react";
import "./App.css";
import * as d3 from "d3";
import { drawMap } from "./drawMap";
import { lineChart } from "./LineChart";
import LineChart from "./test";
import Select from "react-select";

const options = [
  { value: "cases", label: "Cases" },
  { value: "deaths", label: "Deaths" },
  { value: "cured", label: "Cured" },
];

class App extends React.Component {
  state = {
    lastData: null,
    dataByState: [],
    globalData: [],
    covidStatus: [],
    lineGraphData: [],
    curedInCroatiaLineGraphData: [],
    deathsInCroatiaLineGraphData: [],
    flag: true,
    selectedOption: null,
  };

  componentDidMount() {
    fetch("https://www.koronavirus.hr/json/?action=podaci_zadnji")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ lastData: data });
      });

    fetch("https://www.koronavirus.hr/json/?action=podaci")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ covidStatus: data });
        for (let i = 0; i < this.state.covidStatus.length; i++) {
          let covidCase = new CovidCase();

          covidCase.cases = this.state.covidStatus[i].SlucajeviHrvatska;
          covidCase.date = this.state.covidStatus[i].Datum;
          covidCase.cured = this.state.covidStatus[i].IzlijeceniHrvatska;
          covidCase.deaths = this.state.covidStatus[i].UmrliHrvatska;
          this.state.lineGraphData.push(covidCase);
        }
        // lineChart(this.state.lineGraphData);
        this.lineChart2("cases");
        drawMap();
      });

    fetch("https://www.koronavirus.hr/json/?action=po_danima_zupanijama")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ dataByState: data });
      });
  }

  lineChart2 = (data) => {
    console.log("data u funkciji", data.value);

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
        if (data.value === "cases") {
          return y(d.cases);
        } else if (data.value === "deaths") {
          return y(d.deaths);
        } else if (data.value === "cured") {
          return y(d.cured);
        }
      });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("body")
      .append("svg")
      .attr("class", "test")
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
        if (data.value === "cases") {
          return d.cases;
        } else if (data.value === "deaths") {
          return d.deaths;
        } else if (data.value === "cured") {
          return d.cured;
        }
      }),
    ]);
    // Add the valueline path.
    svg
      .append("path")
      .data([this.state.lineGraphData])
      .attr("class", "line")
      .attr("d", valueline);

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
    console.log("update", data);
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
        if (data.value === "cases") {
          return y(d.cases);
        } else if (data.value === "deaths") {
          return y(d.deaths);
        } else if (data.value === "cured") {
          return y(d.cured);
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
        if (data.value === "cases") {
          return d.cases;
        } else if (data.value === "deaths") {
          return d.deaths;
        } else if (data.value === "cured") {
          return d.cured;
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

  change = () => {
    this.setState({ flag: false });
    this.lineChart2(false);
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
    // this.lineChart2(selectedOption);
    this.updateData(selectedOption);
  };
  render() {
    const { selectedOption } = this.state;

    return (
      <React.Fragment>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
        />
        <button onClick={this.change}>Activate Lasers</button>
        {/* <LineChart props={this.state.lineGraphData}></LineChart> */}
        <svg className="test">
          <use xlinkHref="/svg/svg-sprite#my-icon" />
        </svg>
        <div id="my_dataviz"></div>
        <h1>Covid Statistic</h1>
        <h2>Today Statistic</h2>
        {this.state.lastData !== null
          ? this.state.lastData.map((item) => (
              <p key={item.Datum}>Last update: {item.Datum}</p>
            ))
          : "No data"}
      </React.Fragment>
    );
  }
}

class CovidCase {
  constructor(cases, date, deaths, cured) {
    this.cases = cases;
    this.deaths = deaths;
    this.cured = cured;
    this.date = date;
  }
}

export default App;
