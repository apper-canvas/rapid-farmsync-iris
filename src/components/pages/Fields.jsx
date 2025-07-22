import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import FieldGrid from "@/components/organisms/FieldGrid";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import * as fieldService from "@/services/api/fieldService";

const Fields = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadFields = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fieldService.getAllFields();
      setFields(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleDeleteField = async (fieldId) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      try {
        await fieldService.deleteField(fieldId);
        setFields(fields.filter(field => field.Id !== fieldId));
        toast.success("Field deleted successfully");
      } catch (err) {
        toast.error("Failed to delete field");
      }
    }
  };

  const filteredFields = fields.filter((field) => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field.cropVariety?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || field.currentStage === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Layout>
        <Loading type="cards" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Error
          title="Fields Error"
          message={error}
          onRetry={loadFields}
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
              Fields Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage all your farm fields in one place.
            </p>
          </div>
          
          <Button 
            variant="primary" 
            className="mt-4 lg:mt-0"
            onClick={() => toast.info("Add field form coming soon")}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add New Field
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fields by name or crop..."
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="lg:w-48"
          >
            <option value="all">All Status</option>
            <option value="seeding">Seeding</option>
            <option value="growing">Growing</option>
            <option value="ready">Ready</option>
            <option value="harvested">Harvested</option>
          </Select>
        </div>

        {/* Fields Grid */}
        {filteredFields.length === 0 ? (
          <Empty
            title="No Fields Found"
            message={fields.length === 0 
              ? "Start managing your farm by adding your first field."
              : "No fields match your current search criteria."
            }
            actionText="Add Field"
            onAction={() => toast.info("Add field form coming soon")}
            icon="MapPin"
          />
        ) : (
          <FieldGrid
            fields={filteredFields}
            onSelectField={(field) => toast.info(`Viewing field: ${field.name}`)}
            onEditField={(field) => toast.info(`Editing field: ${field.name}`)}
            onDeleteField={handleDeleteField}
          />
        )}
      </div>
    </Layout>
  );
};

export default Fields;