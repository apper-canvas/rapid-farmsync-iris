import React from "react";
import StatCard from "@/components/molecules/StatCard";

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: "Total Fields",
      value: stats.totalFields,
      icon: "MapPin",
      color: "primary"
    },
    {
      title: "Active Crops",
      value: stats.activeCrops,
      icon: "Sprout",
      color: "success"
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: "Clock",
      color: "warning"
    },
    {
      title: "This Month Revenue",
      value: `$${stats.monthlyRevenue?.toLocaleString() || 0}`,
      icon: "DollarSign",
      color: "accent",
      trend: stats.revenueTrend
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
        />
      ))}
    </div>
  );
};

export default DashboardStats;