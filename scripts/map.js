function hexToRgb(hex) {
  if (hex[0] == "#") {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return `rgb(${parseInt(result[1], 16)}, ${parseInt(
      result[2],
      16
    )}, ${parseInt(result[3], 16)})`;
  }

  if (hex.indexOf("rgb") == -1 && hex.indexOf("$") == -1) {
    hex = `#${hex}`;
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return `rgb(${parseInt(result[1], 16)}, ${parseInt(
      result[2],
      16
    )}, ${parseInt(result[3], 16)})`;
  } else {
    return hex;
  }
}

const color = {
  mouseSelection: "rgb(0, 170, 255)",
  selection: "rgb(70, 153, 84)",
};

function createMap(map) {
  const svg = d3.select("#map"),
    width = svg.attr("width"),
    height = svg.attr("height");

  svg.style("display", "block");

  document.getElementById("step1-heading").style.opacity = "0.3";
  document.getElementById("step1-buttons").style.opacity = "0.3";
  document.getElementById("step2-heading").style.display = "inline";
  document.getElementById("step2-subheading").style.display = "inline";
  document.getElementById("button-div").style.display = "flex";

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

  const tooltipMouseOut = function () {
    tooltip.transition().duration(500).style("opacity", 0);

    if (d3.select(this).style("fill") != color.selection) {
      d3.select(this).style("fill", "white");
    }
  };

  const selectionClick = function () {
    if (d3.select(this).style("fill") != color.selection) {
      d3.select(this).style("fill", color.selection);
      d3.select(this).attr("isSelected", "true");
    } else {
      d3.select(this).style("fill", "white");
      d3.select(this).attr("isSelected", "false");
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
          return d.properties.name;
        })
        .attr("country-iso", function (d) {
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
          return d.properties.name;
        })
        .attr("country-iso", function (d) {
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
          return d.properties.name;
        })
        .attr("country-iso", function (d) {
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

function onClickCustomize() {
  document.getElementById("customize").style.display = "none";
  document.getElementById("customize-div").style.display = "block";
  document.getElementById("reset-customize").style.display = "block";
  document.getElementById("stroke").value = "rgb(0, 0, 0)";
  document.getElementById("selection").value = "#469954";
}

function customize() {
  const svg = d3.select("#map");

  svg.style(
    "background-color",
    document.getElementById("background-color").value
  );

  if (
    document.getElementById("stroke").value.indexOf("#") == -1 &&
    document.getElementById("stroke").value.indexOf("rgb") == -1
  )
    svg
      .selectAll("path")
      .style("stroke", `#${document.getElementById("stroke").value}`);
  else {
    svg
      .selectAll("path")
      .style("stroke", document.getElementById("stroke").value);
  }

  if (
    hexToRgb(document.getElementById("selection").value) != "rgb(0, 170, 255)"
  ) {
    svg
      .selectAll("[isSelected=true]")
      .style("fill", hexToRgb(document.getElementById("selection").value));
    color.selection = hexToRgb(document.getElementById("selection").value);
  } else {
    color.selection = hexToRgb(document.getElementById("selection").value);
    color.mouseSelection = "rgb(70, 153, 84)";
  }
}

function resetCustomize() {
  document.getElementById("background-color").value = "";
  document.getElementById("stroke").value = "rgb(0, 0, 0)";
  document.getElementById("selection").value = "#469954";

  customize();
}

function resetSelection() {
  const svg = d3.select("#map");

  svg
    .selectAll("[isSelected=true]")
    .style("fill", "white")
    .attr("isSelected", "false");
}
