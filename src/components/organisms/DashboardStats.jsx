import React from "react";
import StatCard from "@/components/molecules/StatCard";
import { useTranslation } from "@/i18n";

const DashboardStats = ({ stats }) => {
  const { t } = useTranslation();
const statCards = [
    {
      title: t('totalFields'),
      value: stats.totalFields,
      icon: "MapPin",
      color: "primary"
    },
    {
      title: t('activeCrops'),
      value: stats.activeCrops,
      icon: "Sprout",
      color: "success"
    },
    {
      title: t('pendingTasks'),
      value: stats.pendingTasks,
      icon: "Clock",
      color: "warning"
    },
    {
      title: t('monthlyRevenue'),
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