const app = require("./app");

const port = 4008;

app.listen(port, () => {
  console.log("Started express server at port ", `${port}`);
});
