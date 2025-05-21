"use client";

import { UsersTable } from "../../components/UsersTable";
import { useEffect } from "react";

export default function UsersPage() {
  useEffect(() => {
    document.title = "Users Page";
  }, []);

  return (
    <div className="container p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage your application users</p>
      </div>
      <UsersTable />
    </div>
  );
}
