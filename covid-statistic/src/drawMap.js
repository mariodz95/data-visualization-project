import * as d3 from "d3";
import * as topojson from "topojson-client";

export const drawMap = (props) => {
  var opacity = d3.scaleLinear().domain([0, 700]).range([0.4, 1]);
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
    .select(".map")
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
      .style("fill-opacity", function (d) {
        for (let i = 0; i < props.length; i++) {
          if (
            props[i].Zupanija.substring(0, 2) ===
            d.properties.name.substring(0, 2)
          ) {
            return opacity(props[i].broj_zarazenih);
          }
        }
      })
      .style("fill", "yellow")
      .style("stroke", "gray")
      .style("stroke-width", 1)
      .style("stroke-opacity", 1)
      .on("mouseover", function (d) {
        let displayData;
        for (let i = 0; i < props.length; i++) {
          if (
            props[i].Zupanija.substring(0, 2) ===
            d.properties.name.substring(0, 2)
          ) {
            displayData = props[i];
          }
        }
        var tip =
          "<h3>" +
          d.properties.name +
          "</h3>" +
          "<br>" +
          "Broj zaraženih: " +
          displayData.broj_zarazenih +
          "<br>" +
          "Broj umrlih: " +
          displayData.broj_umrlih;
        tooltip
          .html(tip)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY + "px");

        tooltip.transition().duration(500).style("opacity", 0.7);
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  });

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltipMap")
    .style("opacity", 0)
    .style("width", 600);
};
