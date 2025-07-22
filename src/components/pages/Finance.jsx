import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import * as financeService from "@/services/api/financeService";

const Finance = () => {
  const [expenses, setExpenses] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadFinanceData = async () => {
    try {
      setError(null);
      setLoading(true);
      const [expenseData, harvestData] = await Promise.all([
        financeService.getAllExpenses(),
        financeService.getAllHarvests()
      ]);
      setExpenses(expenseData);
      setHarvests(harvestData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load finance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFinanceData();
  }, []);

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await financeService.deleteExpense(expenseId);
        setExpenses(expenses.filter(expense => expense.Id !== expenseId));
        toast.success("Expense deleted successfully");
      } catch (err) {
        toast.error("Failed to delete expense");
      }
    }
  };

  const calculateFinancialStats = () => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalRevenue = harvests.reduce((sum, harvest) => sum + harvest.revenue, 0);
    const profit = totalRevenue - totalExpenses;
    
    // This month calculations
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const monthlyRevenue = harvests
      .filter(harvest => {
        const harvestDate = new Date(harvest.date);
        return harvestDate.getMonth() === currentMonth && harvestDate.getFullYear() === currentYear;
      })
      .reduce((sum, harvest) => sum + harvest.revenue, 0);

    return {
      totalExpenses,
      totalRevenue,
      profit,
      monthlyExpenses,
      monthlyRevenue,
      monthlyProfit: monthlyRevenue - monthlyExpenses
    };
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(expenses.map(exp => exp.category))];
  const stats = calculateFinancialStats();

  if (loading) {
    return (
      <Layout>
        <Loading type="dashboard" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Error
          title="Finance Error"
          message={error}
          onRetry={loadFinanceData}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
              Financial Management
            </h1>
            <p className="text-gray-600">
              Track expenses, revenue, and profitability across your farm.
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 lg:mt-0">
            <Button 
              variant="secondary"
              onClick={() => toast.info("Add harvest form coming soon")}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Record Harvest
            </Button>
            <Button 
              variant="primary"
              onClick={() => toast.info("Add expense form coming soon")}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon="TrendingUp"
            color="success"
          />
          <StatCard
            title="Total Expenses"
            value={`$${stats.totalExpenses.toLocaleString()}`}
            icon="TrendingDown"
            color="error"
          />
          <StatCard
            title="Net Profit"
            value={`$${stats.profit.toLocaleString()}`}
            icon="DollarSign"
            color={stats.profit >= 0 ? "success" : "error"}
          />
          <StatCard
            title="Monthly Profit"
            value={`$${stats.monthlyProfit.toLocaleString()}`}
            icon="Calendar"
            color={stats.monthlyProfit >= 0 ? "success" : "warning"}
          />
        </div>

        {/* Expense Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses..."
            />
          </div>
          
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="lg:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>

        {/* Expense List */}
        {filteredExpenses.length === 0 ? (
          <Empty
            title="No Expenses Found"
            message={expenses.length === 0 
              ? "Start tracking your farm expenses to monitor profitability."
              : "No expenses match your current search criteria."
            }
            actionText="Add Expense"
            onAction={() => toast.info("Add expense form coming soon")}
            icon="Receipt"
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 font-display">Recent Expenses</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredExpenses.slice(0, 10).map((expense) => (
                <div key={expense.Id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{expense.description}</h4>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                        {expense.fieldName && (
                          <>
                            <span className="mx-2">•</span>
                            <ApperIcon name="MapPin" className="h-3 w-3 mr-1" />
                            {expense.fieldName}
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold text-gray-900">
                        ${expense.amount.toLocaleString()}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toast.info(`Editing expense: ${expense.description}`)}
                        >
                          <ApperIcon name="Edit2" className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteExpense(expense.Id)}
                          className="text-error hover:text-error hover:bg-error/10"
                        >
                          <ApperIcon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Finance;