const express = require("express");
const router = express.Router();
const homeController = require("./src/controllers/home");
const uploadController = require("./src/controllers/upload");

let routes = app => {
  router.get("/", homeController.getHome);

  router.post("/upload", uploadController.uploadFile);

  return app.use("/", router);
};

module.exports = routes;
