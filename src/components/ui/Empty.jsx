import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox", 
  title = "No data found", 
  description = "Get started by creating your first item.", 
  actionLabel = "Create New",
  onAction 
}) => {
  return (
    <Card className="p-12 text-center max-w-md mx-auto">
      <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <ApperIcon name={icon} className="h-10 w-10 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8">{description}</p>
      {onAction && (
        <Button onClick={onAction} className="w-full">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default Empty;