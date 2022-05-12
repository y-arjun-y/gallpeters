const express = require("express");
const app = express();

const port = 3000;

app.use("/assets", express.static("assets"));
app.use("/scripts", express.static("scripts"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:map", (req, res) => {
  res.send(
    `
    <html>
    <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>gallpeters</title>
    <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌐</text></svg>"
    />
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <script src="https://d3js.org/d3-geo-projection.v4.min.js"></script>
    <script src="/scripts/map_api.js" type="module"></script>
    <script src="/scripts/map_api.js"></script>
    </head>
    <body>
    <svg
    id="map"
    width="680"
    height="480"
    xmlns="http://www.w3.org/2000/svg"
    ></svg>
    <script>
    createMap("${req.params.map}", "${req.query.select}", "${req.query.background_color}", "${req.query.stroke}", "${req.query.selection_color}");
    </script>
    </body>
    </html>
    `
  );
});

app.listen(port, () => {
  console.log(`gallpeters is listening on port ${port}`);
});

module.exports = app;
