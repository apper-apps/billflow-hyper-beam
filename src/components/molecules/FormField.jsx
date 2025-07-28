import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  type = "text", 
  label, 
  value, 
  onChange, 
  error, 
  options = [],
  ...props 
}) => {
  if (type === "select") {
    return (
      <Select
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        {...props}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }
  
  if (type === "textarea") {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        {...props}
      />
    );
  }
  
return (
    <Input
      type={type}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      {...props}
    />
  );
};

export default FormField;