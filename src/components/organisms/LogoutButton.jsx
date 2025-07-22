import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  
  if (!isAuthenticated) {
    return null;
  }
  
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };
  
  return (
    <div className="flex items-center gap-3 p-4 border-t border-gray-200">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-gray-500">
          {user?.emailAddress}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-gray-500 hover:text-red-600"
        title="Logout"
      >
        <ApperIcon name="LogOut" className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default LogoutButton;