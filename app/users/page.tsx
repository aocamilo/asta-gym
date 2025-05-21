"use client";

import { UsersTable } from "../../components/UsersTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Page",
};

export default function UsersPage() {
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
