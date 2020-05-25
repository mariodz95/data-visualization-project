import React from "react";
import * as d3 from "d3";

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    console.log("props u testu", this.props.props);
  }

  lineChart() {
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
        return y(d.cases);
      });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Scale the range of the data
    x.domain(
      d3.extent(this.props.props, function (d) {
        console.log("d", d);
        return new Date(d.date);
      })
    );
    y.domain([
      0,
      d3.max(this.props.props, function (d) {
        return d.cases;
      }),
    ]);
    console.log("Path");
    // Add the valueline path.
    svg
      .append("path")
      .data([this.props.props])
      .attr("class", "line")
      .attr("d", valueline);

    // Add the X Axis
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add the Y Axis
    svg.append("g").call(d3.axisLeft(y));
  }
  render() {
    return <h1>Hello, {this.lineChart()}</h1>;
  }
}

export default LineChart;
