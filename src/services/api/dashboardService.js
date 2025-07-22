import weatherData from "@/services/mockData/weather.json";
import { getAllFields } from "./fieldService.js";
import { getAllTasks } from "./taskService.js";
import { getAllExpenses, getAllHarvests } from "./financeService.js";

export const getDashboardData = async () => {
  try {
    const [fields, tasks, expenses, harvests] = await Promise.all([
      getAllFields(),
      getAllTasks(),
      getAllExpenses(),
      getAllHarvests()
    ]);

    // Calculate stats with proper field mappings
    const totalFields = fields.length;
    const activeCrops = fields.filter(field => field.status === "active").length;
    const pendingTasks = tasks.filter(task => task.status === "pending").length;
    
    // Calculate monthly revenue (current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyRevenue = harvests
      .filter(harvest => {
        const harvestDate = new Date(harvest.date);
        return harvestDate.getMonth() === currentMonth && harvestDate.getFullYear() === currentYear;
      })
      .reduce((sum, harvest) => sum + (harvest.revenue || 0), 0);

    const totalRevenue = harvests.reduce((sum, harvest) => sum + (harvest.revenue || 0), 0);
    const lastMonthRevenue = monthlyRevenue * 0.85; // Simulated last month data
    const revenueTrend = {
      direction: monthlyRevenue > lastMonthRevenue ? "up" : "down",
      value: lastMonthRevenue > 0 ? `${Math.abs(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)}%` : "0%"
    };

    // Get recent tasks (last 5) - properly sorted by dueDate
    const recentTasks = tasks
      .filter(task => task.dueDate) // Only include tasks with due dates
      .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
      .slice(0, 5);

    return {
      weather: weatherData,
      stats: {
        totalFields,
        activeCrops,
        pendingTasks,
        monthlyRevenue,
        revenueTrend
      },
      recentTasks
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error.message);
    throw new Error("Failed to load dashboard data");
  }
};