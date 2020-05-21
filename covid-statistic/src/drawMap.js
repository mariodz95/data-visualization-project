import * as d3 from "d3";
import * as topojson from "topojson-client";

export const drawMap = (props) => {
  var width = 960;
  var height = 700;
  var projection = d3
    .geoMercator()
    .center([0, 10])
    .scale(6000)
    .translate([17600, 4500])
    .rotate([-180, 0]);

  var path = d3.geoPath().projection(projection);
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "black");

  d3.json("cro_regv3.json").then(function (cro) {
    var data = topojson.feature(cro, cro.objects.layer1);
    var states = svg
      .selectAll("path.county")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("id", function (d) {
        return d.id;
      })
      .attr("d", path)
      .style("fill", "yellow")
      .style("stroke", "gray")
      .style("stroke-width", 1)
      .style("stroke-opacity", 1);
  });
};
