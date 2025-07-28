import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const StatusPill = ({ status }) => {
  const statusConfig = {
    pending: {
      variant: "pending",
      icon: "Clock",
      label: "Pending"
    },
    paid: {
      variant: "paid",
      icon: "CheckCircle",
      label: "Paid"
    },
    overdue: {
      variant: "overdue",
      icon: "AlertCircle",
      label: "Overdue"
    },
    draft: {
      variant: "info",
      icon: "Edit",
      label: "Draft"
    },
    sent: {
      variant: "info",
      icon: "Send",
      label: "Sent"
    },
    accepted: {
      variant: "success",
      icon: "CheckCircle",
      label: "Accepted"
    },
    rejected: {
      variant: "danger",
      icon: "XCircle",
      label: "Rejected"
    }
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant} className="inline-flex items-center gap-1">
      <ApperIcon name={config.icon} className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default StatusPill;