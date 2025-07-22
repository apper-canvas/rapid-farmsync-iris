import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FieldGrid from "@/components/organisms/FieldGrid";
import Layout from "@/components/organisms/Layout";
import SearchBar from "@/components/molecules/SearchBar";
import FieldCreateModal from "@/components/molecules/FieldCreateModal";
import FieldDetailModal from "@/components/molecules/FieldDetailModal";
import FieldEditModal from "@/components/molecules/FieldEditModal";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import * as fieldService from "@/services/api/fieldService";
import { useTranslation } from "@/i18n/index";

const Fields = () => {
  const { t } = useTranslation();
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

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

  const handleCreateField = (newField) => {
    setFields(prevFields => [...prevFields, newField]);
  };

  const handleSelectField = (field) => {
    setSelectedField(field);
    setIsDetailModalOpen(true);
  };

  const handleEditField = (field) => {
    setSelectedField(field);
    setIsEditModalOpen(true);
  };

  const handleFieldUpdated = async (updatedField) => {
    // Refresh the fields list to get the latest data
    await loadFields();
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedField(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedField(null);
  };

const filteredFields = fields.filter((field) => {
    const matchesSearch = field?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         field?.cropVariety?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || field?.currentStage === statusFilter;
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
              {t('fieldsManagement')}
            </h1>
            <p className="text-gray-600">
              {t('fieldsDescription')}
            </p>
          </div>
          
<Button 
            variant="primary" 
            className="mt-4 lg:mt-0"
            onClick={handleOpenCreateModal}
>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {t('addNewField')}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
<div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('searchFields')}
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="lg:w-48"
>
            <option value="all">{t('allStatus')}</option>
            <option value="seeding">{t('seeding')}</option>
            <option value="growing">{t('growing')}</option>
            <option value="ready">{t('ready')}</option>
            <option value="harvested">{t('harvested')}</option>
          </Select>
        </div>

        {/* Fields Grid */}
{filteredFields.length === 0 ? (
          <Empty
            title={t('noFieldsFound')}
            message={fields.length === 0 
              ? t('noFieldsMessage')
              : t('noFieldsSearchMessage')
            }
            actionText={t('addField')}
            onAction={handleOpenCreateModal}
            icon="MapPin"
          />
        ) : (
<FieldGrid
            fields={filteredFields}
            onSelectField={handleSelectField}
            onEditField={handleEditField}
            onDeleteField={handleDeleteField}
          />
        )}
      </div>

<FieldCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onFieldCreated={handleCreateField}
      />

      <FieldDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        field={selectedField}
        onEdit={handleEditField}
      />

      <FieldEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        field={selectedField}
        onFieldUpdated={handleFieldUpdated}
      />
    </Layout>
  );
};

export default Fields;