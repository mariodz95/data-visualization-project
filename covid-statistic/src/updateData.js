import * as d3 from "d3";

// ** Update data section (Called from the onclick)
export const updateData = (data, lineGraphData) => {
  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
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
  // Scale the range of the data again
  x.domain(
    d3.extent(lineGraphData, function (d) {
      return new Date(d.date);
    })
  );
  y.domain([
    0,
    d3.max(lineGraphData, function (d) {
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
    .attr("d", valueline(lineGraphData));
  svg
    .select(".xaxis") // change the x axis
    .duration(750)
    .call(d3.axisBottom(x));
  svg
    .select(".yaxis") // change the y axis
    .duration(750)
    .call(d3.axisLeft(y));
};
