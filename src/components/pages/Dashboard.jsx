import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import DashboardStats from "@/components/organisms/DashboardStats";
import WeatherWidget from "@/components/molecules/WeatherWidget";
import QuickActions from "@/components/organisms/QuickActions";
import RecentTasks from "@/components/organisms/RecentTasks";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getDashboardData } from "@/services/api/dashboardService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      setLoading(true);
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
            Farm Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening on your farm today.
          </p>
        </div>

        {/* Weather Widget */}
        <WeatherWidget weather={data?.weather} />

        {/* Stats Cards */}
        <DashboardStats stats={data?.stats || {}} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Tasks */}
        <RecentTasks
          tasks={data?.recentTasks}
          onViewAll={() => navigate("/tasks")}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;