import { Typography } from "@mui/material";
import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-8 pt-16">
      <Typography 
        variant="h4" 
        component="h1" 
        className="font-bold text-gray-800"
        gutterBottom
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography 
          variant="subtitle1" 
          className="text-gray-600 mb-4"
        >
          {subtitle}
        </Typography>
      )}
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
}