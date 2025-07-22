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
  const inputProps = {
    className: cn(error && "border-error focus:border-error focus:ring-error/20"),
    ...props
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