const tvRoute = require("./tv");


const constructorMethod = app => {
  app.use("/", tvRoute);

  

  app.use("*", (req, res) => {
    res.status(404).render("error",{error:"Check URL"});
  });
};

module.exports = constructorMethod;