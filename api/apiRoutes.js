const { Router } = require("express");
const fs = require("fs").promises;
const path = require("path");
const moment = require("moment");

const apiRoutes = Router();
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

apiRoutes.post("/", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    const expense = req.body;
    const lastId = expenseManager[expenseManager.length - 1]?.id;
    expense.id = lastId ? lastId + 1 : 1;
    expense.createdAt = moment().format("DD/MM/YYYY");
    expenseManager.push(expense);
    console.log(expenseManager);
    await fs.writeFile(filePath, JSON.stringify(expenseManager, null, 2));
    res.send({ success: true, data: expenseManager, message: "expense added" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

apiRoutes.delete("/:id", async (req, res) => {
  try {
    let expenseManager = await readExpenseManager();
    const { id } = req.params;

    const index = expenseManager.findIndex(
      (expense) => expense.id === parseInt(id)
    );

    if (index === -1) {
      res.status(404);
      res.json({ success: false, message: "Expense doesn't exists" });
    }
    const expense = expenseManager[index];
    expenseManager = expenseManager.filter(
      (expense) => expense.id !== parseInt(id)
    );
    await fs.writeFile(filePath, JSON.stringify(expenseManager, null, 2));
    res.json({ success: true, data: expense, message: "expense deleted" });
    console.log(expenseManager);
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

apiRoutes.put("/:id ", async (req, res) => {
  try {
    let expenseManager = await readExpenseManager();
    const changeExpense = req.body;
    console.log("Genadi");
    console.log(changeExpense);
    const { id } = req.params;
    const index = expenseManager.findIndex((exp) => exp.id === parseInt(id));
    if (index === -1) {
      res.status(404);
      res.json({ success: false, message: "Expense not found" });
    }
    let expense = expenseManager[index];
    expense = {
      ...expense,
      ...changeExpense,
    };
    expenseManager[index] = expense;
    res.json({ success: true, data: expense, message: "expense updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

module.exports = apiRoutes;
