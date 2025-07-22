import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = () => new Promise(resolve => setTimeout(resolve, 250));

export const getAllTasks = async () => {
  await delay();
  return [...tasks];
};

export const getTaskById = async (taskId) => {
  await delay();
  const task = tasks.find(t => t.Id === parseInt(taskId));
  if (!task) {
    throw new Error("Task not found");
  }
  return { ...task };
};

export const createTask = async (taskData) => {
  await delay();
  const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
  const newTask = {
    Id: maxId + 1,
    ...taskData,
    status: "pending"
  };
  tasks.push(newTask);
  return { ...newTask };
};

export const updateTask = async (taskId, updates) => {
  await delay();
  const index = tasks.findIndex(t => t.Id === parseInt(taskId));
  if (index === -1) {
    throw new Error("Task not found");
  }
  tasks[index] = { ...tasks[index], ...updates };
  return { ...tasks[index] };
};

export const deleteTask = async (taskId) => {
  await delay();
  const index = tasks.findIndex(t => t.Id === parseInt(taskId));
  if (index === -1) {
    throw new Error("Task not found");
  }
  tasks.splice(index, 1);
  return true;
};

export const getTasksByStatus = async (status) => {
  await delay();
  return tasks.filter(task => task.status === status);
};

export const getTasksByField = async (fieldId) => {
  await delay();
  return tasks.filter(task => task.fieldId === parseInt(fieldId));
};