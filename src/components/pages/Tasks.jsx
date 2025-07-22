import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "@/i18n";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Layout from "@/components/organisms/Layout";
import TaskItem from "@/components/molecules/TaskItem";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import * as taskService from "@/services/api/taskService";

const Tasks = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const loadTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      await taskService.updateTask(taskId, { status: "completed" });
      setTasks(tasks.map(task => 
        task.Id === taskId ? { ...task, status: "completed" } : task
      ));
      toast.success("Task completed successfully");
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(tasks.filter(task => task.Id !== taskId));
        toast.success("Task deleted successfully");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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
          title="Tasks Error"
          message={error}
          onRetry={loadTasks}
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
              {t('taskManagement')}
            </h1>
            <p className="text-gray-600">
              {t('tasksDescription')}
            </p>
          </div>
          
          <Button 
            variant="primary" 
            className="mt-4 lg:mt-0"
            onClick={() => toast.info("Add task form coming soon")}
          >
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {t('createTask')}
          </Button>
        </div>

{/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchTasks')}
          />
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{t('allStatus')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="in-progress">{t('inProgress')}</option>
            <option value="completed">{t('completed')}</option>
            <option value="overdue">{t('overdue')}</option>
          </Select>

          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">{t('allPriority')}</option>
            <option value="high">{t('high')}</option>
            <option value="medium">{t('medium')}</option>
            <option value="low">{t('low')}</option>
          </Select>
        </div>

{/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <Empty
            title={t('noTasksFound')}
            message={tasks.length === 0 
              ? t('noTasksMessage')
              : t('noTasksSearchMessage')
            }
            actionText={t('createTask')}
            onAction={() => toast.info("Add task form coming soon")}
            icon="CheckSquare"
          />
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.Id}
                task={task}
                onComplete={handleCompleteTask}
                onEdit={(task) => toast.info(`Editing task: ${task.title}`)}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;