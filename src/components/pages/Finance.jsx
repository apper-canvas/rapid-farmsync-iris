import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Layout from "@/components/organisms/Layout";
import ExpenseCreateModal from "@/components/molecules/ExpenseCreateModal";
import StatCard from "@/components/molecules/StatCard";
import ExpenseEditModal from "@/components/molecules/ExpenseEditModal";
import SearchBar from "@/components/molecules/SearchBar";
import HarvestCreateModal from "@/components/molecules/HarvestCreateModal";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import * as financeService from "@/services/api/financeService";
import { useTranslation } from "@/i18n/index";

const Finance = () => {
const { t } = useTranslation();
  const [expenses, setExpenses] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("expenses");
const [searchTerm, setSearchTerm] = useState("");
const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
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

const handleExpenseCreated = (newExpense) => {
    setExpenses(prev => [newExpense, ...prev]);
    toast.success("Expense created successfully");
  };

  const handleHarvestCreated = (newHarvest) => {
    setHarvests(prev => [newHarvest, ...prev]);
    toast.success("Harvest record created successfully");
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  const handleExpenseUpdated = (updatedExpense) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.Id === updatedExpense.Id ? updatedExpense : expense
      )
    );
    toast.success("Expense updated successfully");
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase());
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
              {t('financialManagement')}
            </h1>
            <p className="text-gray-600">
              {t('financeDescription')}
            </p>
          </div>
          
<div className="flex gap-2 mt-4 lg:mt-0">
<Button 
              variant="secondary"
              onClick={() => setShowHarvestModal(true)}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              {t('recordHarvest')}
            </Button>
            
            <Button 
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              {t('addExpense')}
            </Button>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('totalRevenue')}
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon="TrendingUp"
            color="success"
          />
          <StatCard
            title={t('totalExpenses')}
            value={`$${stats.totalExpenses.toLocaleString()}`}
            icon="TrendingDown"
            color="error"
          />
          <StatCard
            title={t('netProfit')}
            value={`$${stats.profit.toLocaleString()}`}
            icon="DollarSign"
            color={stats.profit >= 0 ? "success" : "error"}
          />
          <StatCard
            title={t('monthlyProfit')}
            value={`$${stats.monthlyProfit.toLocaleString()}`}
            icon="Calendar"
            color={stats.monthlyProfit >= 0 ? "success" : "warning"}
          />
        </div>
</div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange("expenses")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "expenses"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name="Receipt" className="h-4 w-4 mr-2 inline" />
              Expenses
            </button>
            <button
              onClick={() => handleTabChange("harvests")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "harvests"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ApperIcon name="Wheat" className="h-4 w-4 mr-2 inline" />
              Harvests
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            {/* Expense Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchExpenses')}
                />
              </div>
              
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="lg:w-48"
              >
                <option value="all">{t('allCategories')}</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </div>

            {/* Expense List */}
            {filteredExpenses.length === 0 ? (
              <Empty
                title={t('noExpensesFound')}
                message={expenses.length === 0 
                  ? t('noExpensesMessage')
                  : t('noExpensesSearchMessage')
                }
                actionText={t('addExpense')}
                onAction={() => setShowCreateModal(true)}
                icon="Receipt"
              />
            ) : (
              <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">{t('recentExpenses')}</h3>
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
                              onClick={() => handleEditExpense(expense)}
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
        )}

        {activeTab === "harvests" && (
          <div className="space-y-6">
            {/* Harvest List */}
            {harvests.length === 0 ? (
              <Empty
                title="No Harvests Found"
                message="No harvest records have been created yet."
                actionText="Record Harvest"
                onAction={() => setShowHarvestModal(true)}
                icon="Wheat"
              />
            ) : (
              <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 font-display">Recent Harvests</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {harvests.slice(0, 10).map((harvest) => (
                    <div key={harvest.Id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{harvest.cropVariety}</h4>
                            <Badge variant="success">{harvest.quality}</Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                            {format(new Date(harvest.date), "MMM dd, yyyy")}
                            {harvest.fieldName && (
                              <>
                                <span className="mx-2">•</span>
                                <ApperIcon name="MapPin" className="h-3 w-3 mr-1" />
                                {harvest.fieldName}
                              </>
                            )}
                            <span className="mx-2">•</span>
                            <span>{harvest.quantity} {harvest.unit}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-semibold text-gray-900">
                            ${harvest.revenue?.toLocaleString() || '0'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
)}
          </div>
        )}
      </div>

      <ExpenseCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onExpenseCreated={handleExpenseCreated}
      />

      <ExpenseEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onExpenseUpdated={handleExpenseUpdated}
        expense={selectedExpense}
      />

      <HarvestCreateModal
        isOpen={showHarvestModal}
        onClose={() => setShowHarvestModal(false)}
        onHarvestCreated={handleHarvestCreated}
      />
    </Layout>
  );
};

export default Finance;