import * as d3 from "d3";

export const lineChart = (data, lineGraphData) => {
  //Korištena literatura https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
  //https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
  var tooltip = null;
  if (data.value === "croCases") {
    tooltip = "Hrvatska zaraženi: ";
  } else if (data.value === "croDeaths") {
    tooltip = "Hrvatska umrli: ";
  } else if (data.value === "croCured") {
    tooltip = "Hrvatska izliječeni: ";
  } else if (data.value === "worldCases") {
    tooltip = "Svijet zaraženi: ";
  } else if (data.value === "worldDeaths") {
    tooltip = "Svijet umrli: ";
  } else if (data.value === "worldCured") {
    tooltip = "Svijet izliječeni: ";
  }

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
  // Add the valueline path.
  svg
    .append("path")
    .data([lineGraphData])
    .attr("class", "line")
    .attr("d", valueline);

  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // add the dots with tooltips
  var fixeddot = svg
    .selectAll("dot")
    .data(lineGraphData)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("class", "dots");

  fixeddot
    .attr("cx", function (d) {
      return x(new Date(d.date));
    })
    .attr("cy", function (d) {
      return y(d.croCases);
    })
    .on("mouseover", function (d) {
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html("Datum: " + d.date + "<br>Cro cases: " + d.croCases)
        .style("left", d3.event.pageX - 300 + "px")
        .style("top", d3.event.pageY - 75 + "px");
    })
    .on("mouseout", function (d) {
      div.transition().duration(200).style("opacity", 0);
    });

  // Add the X Axis
  svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add the Y Axis
  svg.append("g").attr("class", "yaxis").call(d3.axisLeft(y));
};
