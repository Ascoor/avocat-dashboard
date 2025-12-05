import React from "react";
import { Outlet } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";

const Dashboard: React.FC = () => {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
};

export default Dashboard;
