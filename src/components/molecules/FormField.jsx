import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false, 
  className,
  children,
  ...props 
}) => {
// Convert value to display-friendly format
  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle lookup objects - display the Name property if available
      return value.Name || value.name || '';
    }
    if (Array.isArray(value)) {
      // Handle array values like coordinates
      return value.join(', ');
    }
    return String(value);
  };

  const inputProps = {
    className: cn(error && "border-error focus:border-error focus:ring-error/20"),
    ...props,
    value: getDisplayValue(props.value)
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-900">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
{children ? (
        React.cloneElement(children, inputProps)
      ) : type === "select" ? (
        <Select {...inputProps}>
          {props.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input type={type} {...inputProps} />
      )}
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;