import * as d3 from "d3";

export const drawPieChart = (update, gender, data) => {
  if (update === true) {
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
    keys = ["Muškarci", "Žene"];
  }
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

  //   // Create dummy data
  //   var data = gender ? this.state.infectedByGender : this.state.covidStatistic;

  // set the color scale
  var color = null;
  if (gender === false) {
    color = d3
      .scaleOrdinal()
      .domain([data])
      .range(["#DC143C", "#00BFFF", "#FFFF00", "#00FF00"]);
  } else {
    color = d3.scaleOrdinal().domain([data]).range(["#DC143C", "#00BFFF"]);
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
};
