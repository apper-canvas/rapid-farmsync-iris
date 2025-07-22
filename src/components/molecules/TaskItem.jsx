import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskItem = ({ task, onComplete, onEdit, onDelete }) => {
  const priorityColors = {
    high: "error",
    medium: "warning", 
    low: "success"
  };

  const statusColors = {
    pending: "warning",
    "in-progress": "primary",
    completed: "success",
    overdue: "error"
  };

  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <Badge variant={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
            <Badge variant={statusColors[task.status]}>
              {task.status}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <div className="flex items-center">
              <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </div>
            {task.assignedTo && (
              <div className="flex items-center">
                <ApperIcon name="User" className="h-3 w-3 mr-1" />
                {task.assignedTo}
              </div>
            )}
            {task.fieldName && (
              <div className="flex items-center">
                <ApperIcon name="MapPin" className="h-3 w-3 mr-1" />
                {task.fieldName}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {task.status !== "completed" && (
            <Button
              size="sm"
              variant="success"
              onClick={() => onComplete(task.Id)}
            >
              <ApperIcon name="Check" className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(task)}
          >
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task.Id)}
            className="text-error hover:text-error hover:bg-error/10"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;