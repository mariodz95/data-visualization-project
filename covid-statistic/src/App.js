import React from "react";
import "./App.css";
import * as d3 from "d3";
import { drawMap } from "./drawMap";
import Select from "react-select";
import LineChartData from "./helpers/LineChartData";
import PieData from "./helpers/PieData";
import GenderData from "./helpers/GenderData";
import { lineChart } from "./LineChart";
import { updateData } from "./updateData";
import { options } from "./helpers/dropDownConstants";
import covid from "./covid.png"; // Tell Webpack this JS file uses this image
import Container from "react-bootstrap/Container";

class App extends React.Component {
  state = {
    lastData: null,
    dataByState: [],
    covidStatus: [],
    lineGraphData: [],
    covidDataByPerson: [],
    selectedOption: null,
    covidStatistic: {},
    infectedByGender: [],
    gender: false,
    update: false,
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
        lineChart(this.state.selectedOption, this.state.lineGraphData);
      });

    fetch("https://www.koronavirus.hr/json/?action=po_osobama")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ covidDataByPerson: data });
        const todayDate = new Date().getFullYear();
        let covidCase = new PieData();
        let genderData = new GenderData();

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
        genderData.male = male;
        genderData.female = female;
        this.setState({ infectedByGender: genderData });
        covidCase.young = young;
        covidCase.youngMedium = youngMedium;
        covidCase.oldMedium = oldMedium;
        covidCase.old = old;
        this.setState({ covidStatistic: covidCase });
        this.drawPieChart(false, false);
        // this.drawBarChart();
      });
  }

  // drawBarChart() {
  //   var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //   var width = 500;
  //   var height = 500;
  //   console.log("tsdasd", this.state.covidStatistic);
  //   var svg = d3
  //     .select("body")
  //     .select(".barChart")
  //     .attr("width", width)
  //     .attr("height", height);
  //   var barchart = svg
  //     .selectAll("rect")
  //     .data(data)
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
  // }

  drawPieChart(test, gender) {
    if (test === true) {
      d3.select(".pieChart").remove();
      d3.select(".legend").remove();

      d3.select("#pie").append("svg").attr("class", "pieChart");
      d3.select("#legend")
        .append("svg")
        .attr("class", "legend")
        .attr("height", 300);
    }
    // set the dimensions and margins of the graph
    // create a list of keys
    var keys = null;
    if (gender === false) {
      keys = ["0-18", "18-35", "35-65", "65<"];
    } else {
      keys = ["muškarci", "žene"];
    }
    console.log("keys", keys);

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
    var data = gender ? this.state.infectedByGender : this.state.covidStatistic;

    // set the color scale
    var color = null;
    if (gender === false) {
      color = d3
        .scaleOrdinal()
        .domain([data])
        .range(["#1E90FF", "#228B22", "#4B0082", "#800000"]);
    } else {
      color = d3.scaleOrdinal().domain([data]).range(["#FFB6C1", "#4169E1"]);
    }

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

    // select the svg area
    var SVG = d3.select(".legend");

    // Add one dot in the legend for each name.
    var size = 20;
    SVG.selectAll("mydots")
      .data(keys)
      .enter()
      .append("rect")
      .attr("x", 100)
      .attr("y", function (d, i) {
        console.log("d", d);
        return 100 + i * (size + 5);
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .attr("class", "rec")
      .style("fill", function (d) {
        return color(d);
      });

    // Add one dot in the legend for each name.
    SVG.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 100 + size * 1.2)
      .attr("y", function (d, i) {
        console.log("d", d);
        return 100 + i * (size + 5) + size / 2;
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d) {
        return color(d);
      })
      .text(function (d) {
        return d;
      })
      .attr("class", "tex")
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    updateData(selectedOption, this.state.lineGraphData);
  };

  changePieData1 = (selectedOption) => {
    this.setState({ gender: false });
    this.setState({ update: true });
    this.drawPieChart(true, false);
  };

  changePieData2 = () => {
    this.setState({ gender: true });
    this.setState({ update: true });

    console.log("gender", this.state.gender);
    this.drawPieChart(true, true);
  };

  render() {
    const { selectedOption } = this.state;
    return (
      <React.Fragment>
        <img className="logo" src={covid} alt="Logo" />
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
        <h2>Zaraženi po godinama:</h2>
        <button onClick={this.changePieData1}>Godine</button>
        <button onClick={this.changePieData2}>Spol</button>
        <br />
        <div className="row">
          <div className="column" id="pie">
            <svg className="pieChart"></svg>
          </div>
          <div className="column" id="legend">
            <svg className="legend" height={300} width={450}></svg>
          </div>
        </div>
        <br />

        <br />
      </React.Fragment>
    );
  }
}

export default App;
