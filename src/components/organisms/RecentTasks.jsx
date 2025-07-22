import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { useTranslation } from "@/i18n";

const RecentTasks = ({ tasks, onViewAll }) => {
  const { t } = useTranslation();
  if (!tasks || tasks.length === 0) {
    return (
<Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">{t('recentTasks')}</h3>
        <div className="text-center py-8">
          <ApperIcon name="CheckSquare" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">{t('noRecentTasks')}</p>
        </div>
      </Card>
    );
  }

  const statusColors = {
    pending: "warning",
    "in-progress": "primary",
    completed: "success",
    overdue: "error"
  };

  return (
    <Card className="p-6">
<div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 font-display">{t('recentTasks')}</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          <span className="text-sm text-primary">{t('viewAll')}</span>
          <ApperIcon name="ArrowRight" className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {tasks.slice(0, 5).map((task) => (
          <div key={task.Id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{task.title}</h4>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                {format(new Date(task.dueDate), "MMM dd")}
                {task.assignedTo && (
                  <>
                    <span className="mx-2">•</span>
                    <ApperIcon name="User" className="h-3 w-3 mr-1" />
                    {task.assignedTo}
                  </>
                )}
              </div>
            </div>
            <Badge variant={statusColors[task.status]} className="ml-4">
              {task.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentTasks;