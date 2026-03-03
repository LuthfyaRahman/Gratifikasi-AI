'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getUsers, updateUser } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { User, UserRole } from '@/types';

const roles = Object.values(UserRole);

export default function AdminUsersPage() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<(User & { is_active?: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => addToast('Failed to load users.', 'error'))
      .finally(() => setLoading(false));
  }, [addToast]);

  async function handleRoleChange(userId: number, newRole: UserRole) {
    setSaving(userId);
    try {
      const updated = await updateUser(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updated } : u)));
      addToast('Role updated.', 'success');
    } catch {
      addToast('Failed to update role.', 'error');
    } finally {
      setSaving(null);
    }
  }

  async function handleToggleActive(user: User & { is_active?: boolean }) {
    setSaving(user.id);
    try {
      const updated = await updateUser(user.id, { is_active: !user.is_active });
      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...updated } : u)));
      addToast(`User ${user.is_active ? 'deactivated' : 'activated'}.`, 'success');
    } catch {
      addToast('Failed to update user.', 'error');
    } finally {
      setSaving(null);
    }
  }

  return (
    <DashboardLayout title="User Management">
      <Card title={`Users (${users.length})`}>
        {loading && <LoadingSpinner />}
        {!loading && users.length === 0 && (
          <p className="text-sm text-gray-500">No users found.</p>
        )}
        {!loading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Username</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 font-mono">{u.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        disabled={saving === u.id}
                        className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r} className="capitalize">
                            {r.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={u.is_active !== false ? 'Active' : 'Inactive'}
                        variant={u.is_active !== false ? 'success' : 'neutral'}
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        variant={u.is_active !== false ? 'danger' : 'success'}
                        loading={saving === u.id}
                        onClick={() => handleToggleActive(u)}
                      >
                        {u.is_active !== false ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
