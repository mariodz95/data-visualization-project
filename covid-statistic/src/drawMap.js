import * as d3 from "d3";
import * as topojson from "topojson-client";

export const drawMap = (props) => {
  //Za iscrtavanje mape korišten je priričnik za LV  i
  //https://mono.software/2017/08/10/d3-js-map-of-croatia/
  // var opacity = d3.scaleLinear().domain([0, 1000]).range([0, 5]);
  var width = 960;
  var height = 700;

  var SVG = d3.select(".mapLegend");
  var colorscale = d3.schemePRGn["11"].reverse();
  var color = d3.scaleQuantize().domain([0, 1000]).range(colorscale);

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
    .style("background", "#3b3434");

  d3.json(
    "https://raw.githubusercontent.com/mariodz95/data-visualization-project/gh-pages/cro.json"
  ).then(function (cro) {
    var data = topojson.feature(cro, cro.objects.layer1);

    svg
      .selectAll("path.county")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("id", function (d) {
        return d.id;
      })
      .attr("d", path)
      .style("fill", function (d) {
        for (let i = 0; i < props.length; i++) {
          if (
            props[i].Zupanija.substring(0, 2) ===
            d.properties.name.substring(0, 2)
          ) {
            return color(props[i].broj_zarazenih);
          }
        }
      })
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

  var format = d3.format(".1f");
  var pallete = SVG.append("g").attr("id", "pallete");
  var swatch = pallete.selectAll("rect").data(colorscale);
  swatch
    .enter()
    .append("rect")
    .attr("fill", function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return i * 50;
    })
    .attr("y", 50)
    .attr("width", 50)
    .attr("height", 10);

  var texts = pallete
    .selectAll("foo")
    .data(color.range())
    .enter()
    .append("text")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .attr("y", 80)
    .attr("x", function (d, i) {
      return i * 50 + 25;
    })
    .text(function (d) {
      return format(color.invertExtent(d)[0]);
    })
    .append("tspan")
    .attr("dy", "1.3em")
    .attr("x", function (d, i) {
      return i * 50 + 25;
    })
    .text("to")
    .append("tspan")
    .attr("dy", "1.3em")
    .attr("x", function (d, i) {
      return i * 50 + 25;
    })
    .text(function (d) {
      return format(color.invertExtent(d)[1]);
    });

  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltipMap")
    .style("opacity", 0)
    .style("width", 600);
};
