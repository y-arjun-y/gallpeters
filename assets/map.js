function saveSVG(element, name) {
  var svgData = element.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {
    type: "image/svg+xml;charset=utf-8",
  });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function createMap(map) {
  const svg = d3.select("#map"),
    width = svg.attr("width"),
    height = svg.attr("height");

  svg.style("display", "block");

  document.getElementById("step1-heading").style.opacity = "0.3";
  document.getElementById("step1-buttons").style.opacity = "0.3";
  document.getElementById("step2-heading").style.display = "inline";
  document.getElementById("step2-subheading").style.display = "inline";
  document.getElementById("save-div").style.display = "block";

  const color = {
    mouseSelection: "rgb(0, 170, 255)",
    selection: "rgb(70, 153, 84)",
  };

  const gallPetersProjection = d3
    .geoCylindricalEqualArea()
    .parallel(45)
    .scale(width / 1.4 / Math.PI)
    .translate([width / 2, height / 2]);

  const mercatorProjection = d3
    .geoMercator()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2]);

  const winkelTripelProjection = d3
    .geoWinkel3()
    .scale(width / 1.5 / Math.PI)
    .translate([width / 2, height / 2]);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  const tooltipMouseOver = function (d) {
    tooltip.transition().duration(200).style("opacity", 0.9);

    tooltip.html(d.toElement.__data__.properties.name);
    tooltip.style("left", d.pageX + 20 + "px");
    tooltip.style("top", d.pageY + 20 + "px");

    if (d3.select(this).style("fill") != color.selection) {
      d3.select(this).style("fill", color.mouseSelection);
    }
  };

  const tooltipMouseOut = function (d) {
    tooltip.transition().duration(500).style("opacity", 0);

    if (d3.select(this).style("fill") != color.selection) {
      d3.select(this).style("fill", "white");
    }
  };

  const selectionClick = function (d) {
    if (d3.select(this).style("fill") != color.selection) {
      d3.select(this).style("fill", color.selection);
    } else {
      d3.select(this).style("fill", "white");
    }
  };

  d3.json("/assets/world.json").then(function (data) {
    if (map == "gallpeters") {
      d3.selectAll("path").remove();

      svg
        .append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", d3.geoPath().projection(gallPetersProjection))
        .attr("country", function (d) {
          return d.id;
        })
        .attr("fill", "#fff")
        .style("stroke", "#000")
        .on("mouseover", tooltipMouseOver)
        .on("mouseout", tooltipMouseOut)
        .on("click", selectionClick);

      document.getElementById("map").style.right = "0";
    } else if (map == "mercator") {
      d3.selectAll("path").remove();

      svg
        .append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", d3.geoPath().projection(mercatorProjection))
        .attr("country", function (d) {
          return d.id;
        })
        .attr("fill", "#fff")
        .style("stroke", "#000")
        .on("mouseover", tooltipMouseOver)
        .on("mouseout", tooltipMouseOut)
        .on("click", selectionClick);

      document.getElementById("map").style.right = "0";
    } else if (map == "winkeltripel") {
      d3.selectAll("path").remove();

      svg
        .append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
        .attr("d", d3.geoPath().projection(winkelTripelProjection))
        .attr("country", function (d) {
          return d.id;
        })
        .attr("fill", "#fff")
        .style("stroke", "#000")
        .on("mouseover", tooltipMouseOver)
        .on("mouseout", tooltipMouseOut)
        .on("click", selectionClick);

      document.getElementById("map").style.right = "1.4em";
    }
  });
}
