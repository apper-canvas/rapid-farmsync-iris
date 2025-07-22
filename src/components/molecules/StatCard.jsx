import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, color = "primary", className }) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    secondary: "text-secondary bg-secondary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    accent: "text-accent bg-accent/10"
  };

  return (
    <Card hover className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 font-display">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
                className={`h-4 w-4 mr-1 ${trend.direction === "up" ? "text-success" : "text-error"}`} 
              />
              <span className={`text-sm font-medium ${trend.direction === "up" ? "text-success" : "text-error"}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;