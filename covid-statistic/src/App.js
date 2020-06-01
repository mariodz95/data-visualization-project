import React from "react";
import "./App.css";
import { drawMap } from "./drawMap";
import Select from "react-select";
import LineChartData from "./helpers/LineChartData";
import PieData from "./helpers/PieData";
import GenderData from "./helpers/GenderData";
import { lineChart } from "./lineChart";
import { updateData } from "./updateData";
import { options } from "./helpers/dropDownConstants";
import covid from "./covid.png";
import { drawPieChart } from "./pieChart";

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
    states: [],
    statesInfected: [],
    statesDeaths: [],
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
        console.log("zadnji podaci ", data[0].PodaciDetaljno);
        for (let i = 0; i < data[0].PodaciDetaljno.length; i++) {
          this.state.dataByState.push(data[0].PodaciDetaljno[i]);
          this.state.states.push(data[0].PodaciDetaljno[i].Zupanija);
          this.state.statesInfected.push(
            data[0].PodaciDetaljno[i].broj_zarazenih
          );
          this.state.statesDeaths.push(data[0].PodaciDetaljno[i].broj_umrlih);
        }
        console.log("zadnji podaci ", this.state.states);

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
        drawPieChart(false, false, this.state.covidStatistic);
      });

    fetch("https://www.koronavirus.hr/json/?action=po_danima_zupanijama")
      .then((data) => {
        return data.json();
      })
      .then((data) => {});
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    updateData(selectedOption, this.state.lineGraphData);
  };

  updateYearData = (selectedOption) => {
    this.setState({ gender: false });
    this.setState({ update: true });
    drawPieChart(true, false, this.state.covidStatistic);
  };

  updateGenderData = () => {
    this.setState({ gender: true });
    this.setState({ update: true });
    drawPieChart(true, true, this.state.infectedByGender);
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
                      <td>Zaraženi u Hrvatskoj: {item.SlucajeviHrvatska}</td>
                      <td>Umrli u Hrvatskoj: {item.UmrliHrvatska}</td>
                      <td>Izliječeni u Hrvatskoj: {item.IzlijeceniHrvatska}</td>
                    </tr>
                    <tr>
                      <td>Zaraženi u svijetu: {item.SlucajeviSvijet}</td>
                      <td>Umrli u svijetu: {item.UmrliSvijet}</td>
                      <td>Izliječeni u svijetu: {item.IzlijeceniSvijet}</td>
                    </tr>
                  </tbody>
                </table>
              </React.Fragment>
            ))
          : "No data"}
        <svg className="map"></svg>
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
          <button className="button1" onClick={this.updateYearData}>
            Godine
          </button>
          <button className="button2" onClick={this.updateGenderData}>
            Spol
          </button>
          <br />
          <div className="row">
            <div className="column" id="pie">
              <svg className="pieChart"></svg>
            </div>
            <div className="column" id="legend">
              <svg className="legend" height={300} width={450}></svg>
            </div>
          </div>
        </div>
        <br />
        <br />
      </React.Fragment>
    );
  }
}

export default App;
