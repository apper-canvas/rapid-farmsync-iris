import expensesData from "@/services/mockData/expenses.json";
import harvestsData from "@/services/mockData/harvests.json";

let expenses = [...expensesData];
let harvests = [...harvestsData];

const delay = () => new Promise(resolve => setTimeout(resolve, 350));

export const getAllExpenses = async () => {
  await delay();
  return [...expenses];
};

export const getAllHarvests = async () => {
  await delay();
  return [...harvests];
};

export const getExpenseById = async (expenseId) => {
  await delay();
  const expense = expenses.find(e => e.Id === parseInt(expenseId));
  if (!expense) {
    throw new Error("Expense not found");
  }
  return { ...expense };
};

export const createExpense = async (expenseData) => {
  await delay();
  const maxId = expenses.length > 0 ? Math.max(...expenses.map(e => e.Id)) : 0;
  const newExpense = {
    Id: maxId + 1,
    ...expenseData
  };
  expenses.push(newExpense);
  return { ...newExpense };
};

export const updateExpense = async (expenseId, updates) => {
  await delay();
  const index = expenses.findIndex(e => e.Id === parseInt(expenseId));
  if (index === -1) {
    throw new Error("Expense not found");
  }
  expenses[index] = { ...expenses[index], ...updates };
  return { ...expenses[index] };
};

export const deleteExpense = async (expenseId) => {
  await delay();
  const index = expenses.findIndex(e => e.Id === parseInt(expenseId));
  if (index === -1) {
    throw new Error("Expense not found");
  }
  expenses.splice(index, 1);
  return true;
};

export const createHarvest = async (harvestData) => {
  await delay();
  const maxId = harvests.length > 0 ? Math.max(...harvests.map(h => h.Id)) : 0;
  const newHarvest = {
    Id: maxId + 1,
    ...harvestData
  };
  harvests.push(newHarvest);
  return { ...newHarvest };
};

export const getExpensesByCategory = async (category) => {
  await delay();
  return expenses.filter(expense => expense.category === category);
};

export const getExpensesByDateRange = async (startDate, endDate) => {
  await delay();
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
  });
};