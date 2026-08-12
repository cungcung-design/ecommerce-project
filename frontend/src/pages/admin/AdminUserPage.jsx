import { useState } from "react";

import AdminUserForm from "../../components/admin/AdminUserForm";
import AdminUserTable from "../../components/admin/AdminUserTable";
import { useAuth } from "../../context/AuthContext";
import {
  useAdminUsers,
  useUpdateAdminUserRole,
  useUpdateAdminUserStatus,
} from "../../hooks/useAdminUsers";

function AdminUserPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user: currentUser } = useAuth();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useAdminUsers(searchTerm);

  const updateStatus = useUpdateAdminUserStatus();
  const updateRole = useUpdateAdminUserRole();

  const handleStatusToggle = (user) => {
    if (user.id === currentUser?.id) {
      window.alert("You cannot deactivate your own account.");
      return;
    }

    const nextStatus = !user.isActive;

    const confirmed = window.confirm(
      `${nextStatus ? "Activate" : "Deactivate"} this user?`
    );

    if (!confirmed) return;

    updateStatus.mutate({ id: user.id, isActive: nextStatus });
  };

  const handleRoleChange = (user, role) => {
    if (user.id === currentUser?.id && role !== "ADMIN") {
      window.alert("You cannot change your own role to Customer.");
      return;
    }

    updateRole.mutate({ id: user.id, role });
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage registered users and account status
          </p>
        </div>

        <AdminUserForm
          searchTerm={searchTerm}
          onSearchChange={(value) => setSearchTerm(value)}
        />
      </div>

      {isLoading && <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading users...</div>}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          Failed to load users.
        </div>
      )}

      {!isLoading && !isError && (
        <AdminUserTable
          users={users}
          currentUserId={currentUser?.id}
          onStatusToggle={handleStatusToggle}
          onRoleChange={handleRoleChange}
        />
      )}
    </div>
  );
}

export default AdminUserPage;
