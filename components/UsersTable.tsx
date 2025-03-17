"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

// Define our data type
type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  joined: string;
  lastActive: string;
  website?: string;
};

// Mock data with 10 entries
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    role: "Admin",
    joined: "2023-01-15",
    lastActive: "2023-08-28",
    website: "https://johndoe.com",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
    role: "Editor",
    joined: "2023-02-10",
    lastActive: "2023-08-27",
    website: "https://janesmith.com",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    status: "inactive",
    role: "Viewer",
    joined: "2023-01-05",
    lastActive: "2023-06-15",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    status: "active",
    role: "Editor",
    joined: "2023-03-22",
    lastActive: "2023-08-26",
    website: "https://emilydavis.io",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    status: "pending",
    role: "Viewer",
    joined: "2023-07-12",
    lastActive: "2023-08-20",
  },
  {
    id: "6",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    status: "active",
    role: "Admin",
    joined: "2022-11-30",
    lastActive: "2023-08-28",
    website: "https://sarahwilson.dev",
  },
  {
    id: "7",
    name: "David Martinez",
    email: "david.m@example.com",
    status: "inactive",
    role: "Editor",
    joined: "2022-10-15",
    lastActive: "2023-05-10",
  },
  {
    id: "8",
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    status: "active",
    role: "Viewer",
    joined: "2023-04-05",
    lastActive: "2023-08-25",
  },
  {
    id: "9",
    name: "Kevin Taylor",
    email: "kevin.t@example.com",
    status: "pending",
    role: "Editor",
    joined: "2023-07-25",
    lastActive: "2023-08-15",
  },
  {
    id: "10",
    name: "Amanda Lewis",
    email: "amanda.l@example.com",
    status: "active",
    role: "Admin",
    joined: "2022-12-10",
    lastActive: "2023-08-27",
    website: "https://amandalewis.net",
  },
];

const getStatusBadge = (status: User["status"]) => {
  const colors = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter the users based on search term
  const filteredUsers = mockUsers.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sort the users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === undefined) return sortDirection === "asc" ? -1 : 1;
    if (bValue === undefined) return sortDirection === "asc" ? 1 : -1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Function to toggle sort
  const toggleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button>Add User</Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Name
                <span className="ml-1">
                  {sortField === "name"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => toggleSort("joined")}
              >
                Joined
                <span className="ml-1">
                  {sortField === "joined"
                    ? sortDirection === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </span>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Website
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(user.joined).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.website ? (
                    <Link
                      href={user.website}
                      target="_blank"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Visit <span className="ml-1">→</span>
                    </Link>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 py-1 text-sm"
                      onClick={() => console.log(`Edit user ${user.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to delete ${user.name}?`
                          )
                        ) {
                          console.log(`Delete user ${user.id}`);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div>
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, sortedUsers.length)} of{" "}
          {sortedUsers.length} users
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
