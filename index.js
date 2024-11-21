const express = require("express");
const fs = require("fs").promises;
const expensesRoutes = require("./expenses/expensesRoutes");
const apiRoutes = require("./api/apiRoutes");
const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.use("/expenses", expensesRoutes);
app.use("/api/expenses", apiRoutes);

app.get("/", (req, res) => {
  res.send("Go to expenses page");
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
