const bodyParser = require("body-parser");
const busboy = require("connect-busboy");
const express = require("express");
const fs = require('fs');
const path = require("path");

const confHelper = require("./config");
const routes = require("./routes");
const database = require("./database");

const app = express();
app.use(bodyParser.json());
app.use(busboy());

if(!confHelper.initConfig()) {
    console.error("Server error : configuration file loading failed without recovery.");
    console.info("There was an error reading the configuration file.");
    process.exit(-1);
}
const config = confHelper.config;

database.init();

app.use("/img", express.static(config.imageFolder));
app.use("/thumb", express.static(config.thumbnailFolder));
app.use("/api", require("./api"));
routes.init(app);

app.listen(config.port, function() {
    console.info(`Started app on port ${config.port}`);
}).on("error", function(err) {
    console.info("Error opening the server. Are you sure the given port is valid ?");
    console.error(`Server error : ${err.message}`);
    console.error(err);
    process.exit(-1);
});
