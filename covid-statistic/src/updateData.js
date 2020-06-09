import * as d3 from "d3";

export const updateData = (data, lineGraphData) => {
  //https://bl.ocks.org/d3noob/7030f35b72de721622b8
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

  var dot = d3
    .select("body")
    .select(".lineChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var body = d3.select("body");

  body.selectAll(".dots").remove();

  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  div.selectAll("div").remove();

  // add the dots with tooltips
  var fixeddot = dot
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
    })
    .on("mouseover", function (d) {
      div.transition().duration(200).style("opacity", 0.9);
      var number = null;
      if (data.value === "croCases") {
        number = d.croCases;
      } else if (data.value === "croDeaths") {
        number = d.croDeaths;
      } else if (data.value === "croCured") {
        number = d.croCured;
      } else if (data.value === "worldCases") {
        number = d.worldCases;
      } else if (data.value === "worldDeaths") {
        number = d.worldDeaths;
      } else if (data.value === "worldCured") {
        number = d.worldCured;
      }
      div
        .html("Datum: " + d.date + "<br>" + tooltip + number)
        .style("left", d3.event.pageX - 300 + "px")
        .style("top", d3.event.pageY - 75 + "px");
    })
    .on("mouseout", function (d) {
      div.transition().duration(500).style("opacity", 0);
    });
};
