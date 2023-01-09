const app = require("./app");

const port = 3009;

app.listen(port, () => {
  console.log("Started express server at port ", `${port}`);
});
