import React from "react";
import "./App.css";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { drawMap } from "./drawMap";

class App extends React.Component {
  state = {
    lastData: null,
    dataByState: [],
  };

  componentDidMount() {
    fetch("https://www.koronavirus.hr/json/?action=podaci_zadnji")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ lastData: data });
      });

    fetch("https://www.koronavirus.hr/json/?action=po_danima_zupanijama")
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        this.setState({ dataByState: data });
      });
    drawMap();
  }
  render() {
    console.log("Render", this.state.lastData);
    return (
      <React.Fragment>
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
export default App;
