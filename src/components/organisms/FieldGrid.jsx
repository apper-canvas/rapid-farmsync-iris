import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const FieldGrid = ({ fields, onSelectField, onEditField, onDeleteField }) => {
  const getStatusColor = (status) => {
    const colors = {
      seeding: "seeding",
      growing: "growing", 
      ready: "ready",
      harvested: "harvested"
    };
    return colors[status] || "default";
  };

  const getDaysToHarvest = (expectedHarvest) => {
    if (!expectedHarvest) return null;
    const days = differenceInDays(new Date(expectedHarvest), new Date());
    return days > 0 ? days : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields.map((field, index) => (
        <motion.div
          key={field.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  {field.name}
                </h3>
                <p className="text-sm text-gray-500">{field.area} acres • {field.soilType}</p>
              </div>
              <Badge variant={getStatusColor(field.currentStage)}>
                {field.currentStage}
              </Badge>
            </div>

            {field.cropVariety && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <ApperIcon name="Sprout" className="h-4 w-4 text-secondary mr-2" />
                  <span className="text-sm font-medium text-gray-900">{field.cropVariety}</span>
                </div>
                
                {field.plantDate && (
                  <div className="flex items-center text-xs text-gray-500">
                    <ApperIcon name="Calendar" className="h-3 w-3 mr-1" />
                    Planted: {format(new Date(field.plantDate), "MMM dd, yyyy")}
                  </div>
                )}
                
                {field.expectedHarvest && getDaysToHarvest(field.expectedHarvest) && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <ApperIcon name="Clock" className="h-3 w-3 mr-1" />
                    {getDaysToHarvest(field.expectedHarvest)} days to harvest
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Button
                size="sm"
                variant="primary"
                onClick={() => onSelectField(field)}
                className="flex-1 mr-2"
              >
                <ApperIcon name="Eye" className="h-4 w-4 mr-2" />
                View Details
              </Button>
              
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEditField(field)}
                >
                  <ApperIcon name="Edit2" className="h-4 w-4" />
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteField(field.Id)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default FieldGrid;