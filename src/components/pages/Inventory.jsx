import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@/i18n";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import InventoryTable from "@/components/organisms/InventoryTable";
import Layout from "@/components/organisms/Layout";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import InventoryCreateModal from "@/components/molecules/InventoryCreateModal";
import * as inventoryService from "@/services/api/inventoryService";

const Inventory = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const handleCreateItem = async (itemData) => {
    try {
      const newItem = await inventoryService.createItem(itemData);
      setItems(prevItems => [...prevItems, newItem]);
      toast.success("Item created successfully");
    } catch (err) {
      toast.error("Failed to create item");
      throw err;
    }
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
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
              {t('inventoryManagement')}
            </h1>
            <p className="text-gray-600">
              {t('inventoryDescription')}
            </p>
          </div>
          
<Button 
            variant="primary" 
            className="mt-4 lg:mt-0"
            onClick={handleOpenCreateModal}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {t('addItem')}
          </Button>
        </div>

        {/* Filters */}
<div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchInventory')}
            />
          </div>
          
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="lg:w-48"
          >
            <option value="all">{t('allCategories')}</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>

        {/* Inventory Table */}
        {filteredItems.length === 0 ? (
<Empty
            title={t('noInventoryItems')}
            message={items.length === 0 
              ? t('noInventoryMessage')
              : t('noInventorySearchMessage')
            }
            actionText={t('addItem')}
            onAction={handleOpenCreateModal}
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

      <InventoryCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateItem}
      />
    </Layout>
  );
};

export default Inventory;