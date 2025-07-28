import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ type = "cards", count = 4 }) => {
  if (type === "table") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3 animate-pulse"></div>
              </div>
              <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-24"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-20"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-5/6"></div>
            </div>
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Loading;