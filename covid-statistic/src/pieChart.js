import * as d3 from "d3";

export const drawPieChart = (update, gender, data) => {
  //Za izradu legend https://www.d3-graph-gallery.com/graph/custom_legend.html
  let total = null;

  if (update === true) {
    d3.select(".pieChart").remove();
    d3.select(".legend").remove();

    d3.select("#pie").append("svg").attr("class", "pieChart");
    d3.select("#legend")
      .append("svg")
      .attr("class", "legend")
      .attr("height", 200);
  }
  // set the dimensions and margins of the graph
  // create a list of keys
  var keys = null;
  if (gender === false) {
    keys = ["0-18", "18-35", "35-65", "65<"];
    total = data.old + data.oldMedium + data.young + data.youngMedium;
  } else {
    keys = ["Muškarci", "Žene"];
    total = data.male + data.female;
  }
  var width = 450;
  var height = 450;
  var margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  var radius = Math.min(width, height) / 2 - margin;

  var svg = d3
    .select("body")
    .select(gender === false ? ".pieChart" : ".pieChartGender")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // set the color scale
  var color = null;
  if (gender === false) {
    color = d3
      .scaleOrdinal()
      .domain([data])
      .range(["green", "red", "orange", "brown"]);
  } else {
    color = d3.scaleOrdinal().domain([data]).range(["#DC143C", "#00BFFF"]);
  }

  // Compute the position of each group on the pie:
  var pie = d3.pie().value(function (d) {
    let percentage = (d.value / total) * 100;
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

  var arc = d3.arc().innerRadius(0).outerRadius(radius);

  // shape helper to build arcs:
  var arcGenerator = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius + 75);

  // Now add the annotation. Use the centroid method to get the best coordinates
  svg
    .selectAll("mySlices")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function (d) {
      return Number((d.value / total) * 100).toFixed(2) + " %";
    })
    .attr("transform", function (d) {
      return "translate(" + arcGenerator.centroid(d) + ")";
    })
    .style("text-anchor", "middle")
    .style("font-size", 25);

  // select the svg area
  if (gender === false) {
    var SVG = d3.select(".legend");
  } else {
    var SVG = d3.select(".legendGender");
  }

  // Add one dot in the legend for each name.
  var size = 20;
  SVG.selectAll("mydots")
    .data(keys)
    .enter()
    .append("rect")
    .attr("x", 100)
    .attr("y", function (d, i) {
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
