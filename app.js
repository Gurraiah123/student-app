const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Student App Running on ECS 🚀");
});

app.listen(8080, () => console.log("Running on 8080"));
