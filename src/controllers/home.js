const path = require("path");

const home = (req, res) => {
  return res.sendFile(path.join(__dirname, "./templates/views/profile.ejs"));
};

module.exports = {
  getHome: home
};
