import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import InventoryTable from "@/components/organisms/InventoryTable";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import * as inventoryService from "@/services/api/inventoryService";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const loadInventory = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await inventoryService.getAllItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await inventoryService.deleteItem(itemId);
        setItems(items.filter(item => item.Id !== itemId));
        toast.success("Item deleted successfully");
      } catch (err) {
        toast.error("Failed to delete item");
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(items.map(item => item.category))];

  if (loading) {
    return (
      <Layout>
        <Loading type="list" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Error
          title="Inventory Error"
          message={error}
          onRetry={loadInventory}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600">
              Track stock levels and manage farm supplies efficiently.
            </p>
          </div>
          
          <Button 
            variant="primary" 
            className="mt-4 lg:mt-0"
            onClick={() => toast.info("Add inventory form coming soon")}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inventory items..."
            />
          </div>
          
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="lg:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>

        {/* Inventory Table */}
        {filteredItems.length === 0 ? (
          <Empty
            title="No Inventory Items"
            message={items.length === 0 
              ? "Start tracking your farm supplies by adding inventory items."
              : "No items match your current search criteria."
            }
            actionText="Add Item"
            onAction={() => toast.info("Add inventory form coming soon")}
            icon="Package"
          />
        ) : (
          <InventoryTable
            items={filteredItems}
            onEditItem={(item) => toast.info(`Editing item: ${item.name}`)}
            onDeleteItem={handleDeleteItem}
          />
        )}
      </div>
    </Layout>
  );
};

export default Inventory;