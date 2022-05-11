function toTitleCase(str) {
  return str.replace(/\b(?:(?!of)(?!the)\w)+\b/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const color = {
  selection: "rgb(70, 153, 84)",
};

function createMap(map, selected, backgroundColor, stroke, selectionColor) {
  const svg = d3.select("#map"),
    width = svg.attr("width"),
    height = svg.attr("height");

  svg.style("display", "block");

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

  svg.style("background-color", backgroundColor);

  if (selectionColor != "undefined") {
    if (selectionColor.indexOf("rgb") == -1) {
      color.selection = `#${selectionColor}`;
    } else {
      color.selection = selectionColor;
    }
  }

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
        .style("stroke", "#000");

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
        .style("stroke", "#000");

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
        .style("stroke", "#000");

      document.getElementById("map").style.right = "1.4em";
    }

    for (let country of selected.split(",")) {
      if (country.length == 3) {
        country = country.toUpperCase();
      } else {
        if (country.indexOf("%20") > -1) {
          country.replace("%20", " ");
        }
        country = toTitleCase(country);
      }
      svg.select(`[country-iso='${country}']`).style("fill", color.selection);

      svg.select(`[country='${country}']`).style("fill", color.selection);
    }

    if (stroke.indexOf("rgb") == -1) {
      svg.selectAll("path").style("stroke", `#${stroke}`);
    } else {
      svg.selectAll("path").style("stroke", stroke);
    }
  });
}
