import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const InventoryTable = ({ items, onEditItem, onDeleteItem }) => {
  const getStockStatus = (quantity, minStock) => {
    if (quantity <= 0) return { status: "Out of Stock", variant: "error" };
    if (quantity <= minStock) return { status: "Low Stock", variant: "warning" };
    return { status: "In Stock", variant: "success" };
  };

  const getStockPercentage = (quantity, minStock) => {
    const maxStock = minStock * 3; // Assume max stock is 3x minimum
    return Math.min((quantity / maxStock) * 100, 100);
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 font-display">Inventory Items</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => {
              const stockStatus = getStockStatus(item.quantity, item.minStock);
              const stockPercentage = getStockPercentage(item.quantity, item.minStock);
              
              return (
                <tr key={item.Id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">Min: {item.minStock} {item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {item.quantity} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={stockStatus.variant}>
                      {stockStatus.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stockPercentage > 50
                            ? "bg-gradient-to-r from-success to-green-600"
                            : stockPercentage > 20
                            ? "bg-gradient-to-r from-warning to-yellow-600"
                            : "bg-gradient-to-r from-error to-red-600"
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {stockPercentage.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditItem(item)}
                      >
                        <ApperIcon name="Edit2" className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDeleteItem(item.Id)}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default InventoryTable;