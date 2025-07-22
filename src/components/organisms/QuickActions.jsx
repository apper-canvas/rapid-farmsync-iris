import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: "Plus",
      label: "Add Field",
      onClick: () => navigate("/fields"),
      color: "from-primary to-secondary"
    },
    {
      icon: "CheckSquare",
      label: "New Task",
      onClick: () => navigate("/tasks"),
      color: "from-accent to-orange-600"
    },
    {
      icon: "Package",
      label: "Update Inventory",
      onClick: () => navigate("/inventory"),
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "Receipt",
      label: "Add Expense",
      onClick: () => navigate("/finance"),
      color: "from-blue-500 to-blue-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="secondary"
            className={`w-full h-24 flex-col bg-gradient-to-br ${action.color} text-white hover:scale-105 shadow-lg hover:shadow-xl border-0`}
            onClick={action.onClick}
          >
            <ApperIcon name={action.icon} className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">{action.label}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};

export default QuickActions;