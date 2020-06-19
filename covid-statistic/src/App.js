import React from "react";
import "./App.css";
import { drawMap } from "./drawMap";
import Select from "react-select";
import LineChartData from "./helpers/LineChartData";
import BarChartData from "./helpers/BarChartData";
import PieData from "./helpers/PieData";
import GenderData from "./helpers/GenderData";
import { lineChart } from "./lineChart";
import { updateData } from "./updateData";
import { options } from "./helpers/dropDownConstants";
import covid from "./covid.png";
import { drawPieChart } from "./pieChart";
import * as d3 from "d3";
import NumberFormat from "react-number-format";

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
    barChartData: [],
    states: [],
    statesInfected: [],
    statesDeaths: [],
  };

  componentDidMount() {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://www.koronavirus.hr/json/?action=podaci_zadnji"
    )
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
          this.state.states.push(data[0].PodaciDetaljno[i].Zupanija);
          this.state.statesInfected.push(
            data[0].PodaciDetaljno[i].broj_zarazenih
          );
          this.state.statesDeaths.push(data[0].PodaciDetaljno[i].broj_umrlih);
          var test = new BarChartData(
            data[0].PodaciDetaljno[i].broj_zarazenih,
            data[0].PodaciDetaljno[i].Zupanija
          );
          this.state.barChartData.push(test);
        }
        console.log("this.", this.state.dataByState);
        drawMap(this.state.dataByState);
        this.drawBarChart();
      });

    fetch(
      "https://cors-anywhere.herokuapp.com/https://www.koronavirus.hr/json/?action=podaci"
    )
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

    fetch(
      "https://cors-anywhere.herokuapp.com/https://www.koronavirus.hr/json/?action=po_osobama"
    )
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
        drawPieChart(false, false, this.state.covidStatistic);
        drawPieChart(false, true, this.state.infectedByGender);
      });
  }

  drawBarChart = () => {
    //https://vijayt.com/post/plotting-bar-chart-d3-react/
    const width = 1100;
    const height = 500;

    const svg = d3
      .select("body")
      .select(".barChart")
      .attr("id", "chart")
      .attr("width", width)
      .attr("height", height);

    const margin = {
      top: 60,
      bottom: 210,
      left: 80,
      right: 40,
    };

    const chart = svg
      .append("g")
      .classed("display", true)
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    this.plot(chart, chartWidth, chartHeight);
  };

  plot = (chart, chartWidth, chartHeight) => {
    const width = chartWidth;
    const height = chartHeight;

    const xScale = d3
      .scaleBand()
      .domain(this.state.barChartData.map((d) => d.state))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.state.barChartData, (d) => d.value)])
      .range([height, 0]);

    var myColor = d3
      .scaleSequential()
      .domain([1, 24])
      .interpolator(d3.interpolateViridis);

    chart
      .selectAll(".bar")
      .data(this.state.barChartData)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", (d) => xScale(d.state))
      .attr("y", (d) => yScale(d.value))
      .attr("height", (d) => height - yScale(d.value))
      .attr("width", (d) => xScale.bandwidth())
      .style("fill", (d, i) => myColor(i));

    chart
      .selectAll(".barLabel")
      .data(this.state.barChartData)
      .enter()
      .append("text")
      .classed("barLabel", true)
      .style("fill", "white")
      .attr("x", (d) => xScale(d.state) + xScale.bandwidth() / 2)
      .attr("dx", -10)
      .attr("y", (d) => yScale(d.value))
      .attr("dy", -6)
      .text((d) => d.value);

    const xAxis = d3.axisBottom().ticks(25).scale(xScale);

    chart
      .append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
        return "rotate(-65)";
      });

    const yAxis = d3.axisLeft().ticks(5).scale(yScale);

    chart
      .append("g")
      .classed("yAxis", true)
      .attr("transform", "translate(0,0)")
      .call(yAxis);

    chart
      .select(".yAxis")
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("transform", `translate(-50, ${height / 2}) rotate(-90)`)
      .attr("fill", "white")
      .style("font-size", "14px")
      .style("text-anchor", "middle")
      .text("Broj zaraženih");

    const yGridlines = d3
      .axisLeft()
      .scale(yScale)
      .ticks(5)
      .tickSize(-width, 0, 0)
      .tickFormat("");

    chart.append("g").call(yGridlines).classed("gridline", true);
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    updateData(selectedOption, this.state.lineGraphData);
  };
  render() {
    const { selectedOption } = this.state;
    return (
      <React.Fragment>
        <img className="logo" src={covid} alt="Logo" />
        <h1>Covid-19</h1>
        {this.state.lastData !== null
          ? this.state.lastData.map((item) => (
              <React.Fragment>
                <h4 key={item.Datum}>Ažurirano: {item.Datum}</h4>
                <h4>
                  Trenutno zaraženih:{" "}
                  {item.SlucajeviHrvatska - item.IzlijeceniHrvatska}
                </h4>
                <table>
                  <tbody className="tableBody">
                    <tr>
                      <td>
                        Zaraženi u Hrvatskoj:{" "}
                        <NumberFormat
                          value={item.SlucajeviHrvatska}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
                      <td>
                        Umrli u Hrvatskoj:{" "}
                        <NumberFormat
                          value={item.UmrliHrvatska}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
                      <td>
                        Izliječeni u Hrvatskoj:{" "}
                        <NumberFormat
                          value={item.IzlijeceniHrvatska}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Zaraženi u svijetu:{" "}
                        <NumberFormat
                          value={item.SlucajeviSvijet}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
                      <td>
                        Umrli u svijetu:{" "}
                        <NumberFormat
                          value={item.UmrliSvijet}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </td>
                      <td>
                        Izliječeni u svijetu:{" "}
                        <NumberFormat
                          value={item.IzlijeceniSvijet}
                          displayType={"text"}
                          thousandSeparator={true}
                        />{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ))
          : "No data"}
        <svg className="map"></svg>
        <br />
        <svg className="barChart"></svg>
        <br />
        <div className="chartDiv">
          <div className="select">
            <Select
              value={selectedOption}
              onChange={this.handleChange}
              options={options}
            />
          </div>
          <svg className="lineChart"></svg>
        </div>
        <br />
        <div className="chartDiv">
          <h2>Zaraženi-statistika:</h2>
          <div className="row">
            <div className="column" id="pie">
              <svg className="pieChart"></svg>
              <svg className="legend" height={200} width={200}></svg>
            </div>
            <div className="column" id="pieGender">
              <svg className="pieChartGender"></svg>
              <svg className="legendGender" height={200} width={200}></svg>
            </div>
            <div className="column" id="legend"></div>
          </div>
        </div>
        <br />
      </React.Fragment>
    );
  }
}

export default App;
