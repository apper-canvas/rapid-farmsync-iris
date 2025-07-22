import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found",
  message = "There's nothing here yet. Start by adding some data.",
  actionText = "Get Started",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center"
    >
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-full mb-6">
        <ApperIcon name={icon} className="h-16 w-16 text-primary" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md text-lg">
        {message}
      </p>
      
      {onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          size="lg"
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-200"
        >
          <ApperIcon name="Plus" className="h-5 w-5 mr-2" />
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;