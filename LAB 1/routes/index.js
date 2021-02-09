const apiRoute = require("./api");
//const bandRoute = require("./bands");
//const bodyParser = require("body-parser");

const constructorMethod = app => {
  app.use("/api", apiRoute);
 // app.use("/bands",bandRoute);
  //app.use(bodyParser.json());
  

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;
