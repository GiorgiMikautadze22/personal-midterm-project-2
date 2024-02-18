const { Router } = require("express");
const fs = require("fs").promises;
const path = require("path");

const expensesRoutes = Router();
const filePath = path.join(__dirname, "../data.json");

async function readExpenseManager() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const expenseManager = JSON.parse(data);
    return expenseManager;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

expensesRoutes.get("/", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    res.render("index", { expenseManager });
  } catch {
    res.status(500).send("Server error");
  }
});
expensesRoutes.get("/:id", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    const id = parseInt(req.params.id);
    const index = expenseManager.findIndex((expense) => expense.id === id);

    if (index === -1) {
      res.status(404).send("Not found");
    }

    const expense = expenseManager[index];

    res.render("singleExpense", { expense });
  } catch {
    res.status(500).send("Server error");
  }
});

module.exports = expensesRoutes;
