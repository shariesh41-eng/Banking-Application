import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { MOCK_USERS } from '../../data/mockBankingData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  Search,
  UserPlus,
  Shield,
  Key,
  CheckCircle2,
  Lock,
  UserCheck,
} from 'lucide-react';

export function UserManagementPage() {
  const { switchRole, user: activeUser } = useAuth();
  const { success } = useNotification();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('customer');

  const filteredUsers = MOCK_USERS.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSwitchToUser = (targetRole, name) => {
    switchRole(targetRole);
    success(`Impersonation session established for ${name} (${targetRole.toUpperCase()})`);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    success(`User ${newUserName} (${newUserRole}) provisioned with temporary access token.`);
    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const columns = [
    {
      header: 'Identity & Legal Name',
      key: 'name',
      render: (_, u) => (
        <div className="flex items-center gap-3">
          <img
            src={u.avatar}
            alt={u.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                {u.name}
              </span>
              {activeUser?.id === u.id && (
                <Badge variant="teal" size="sm">You</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Role & Classification',
      key: 'role',
      render: (v) => {
        const variants = {
          admin: 'error',
          employee: 'teal',
          customer: 'royal',
        };
        return (
          <Badge variant={variants[v] || 'neutral'} size="sm">
            {v.toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Department / Tier',
      key: 'title',
      render: (_, u) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {u.department || u.membershipTier || u.title}
        </span>
      ),
    },
    {
      header: 'Security & 2FA',
      key: 'twoFactorEnabled',
      align: 'center',
      render: (v) => (
        <Badge variant={v !== false ? 'success' : 'warning'} size="sm" dot>
          {v !== false ? '2FA ACTIVE' : 'PENDING'}
        </Badge>
      ),
    },
    {
      header: 'Quick Impersonation',
      key: 'id',
      align: 'right',
      render: (_, u) => (
        <Button
          variant="outline"
          size="xs"
          icon={UserCheck}
          onClick={() => handleSwitchToUser(u.role, u.name)}
        >
          Assume Role
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            User Directory & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage administrative privileges, customer wealth tiers, and employee assignments.
          </p>
        </div>

        <Button
          variant="primary"
          icon={UserPlus}
          onClick={() => setIsAddUserOpen(true)}
        >
          Provision User
        </Button>
      </div>

      {/* Filters Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              placeholder="Search user by name or institutional email..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="all">All Architectural Roles</option>
              <option value="customer">Customers Only</option>
              <option value="employee">Bank Employees Only</option>
              <option value="admin">Super Admins Only</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs text-slate-500">
              {filteredUsers.length} Users Listed
            </span>
          }
        >
          <CardTitle>Provisioned Identities</CardTitle>
          <CardDescription>Authentication records and delegated permission groups</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={filteredUsers} />
        </CardContent>
      </Card>

      {/* Provision User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Provision New Bank Identity"
        description="Creates a new credential record with automated hardware key enrollment."
        size="md"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Jordan Vance"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            required
          />

          <Input
            label="Corporate / Primary Email"
            type="email"
            placeholder="e.g. j.vance@novabank.com"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Role Authority Level
            </label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="customer">Customer (Private Wealth)</option>
              <option value="employee">Employee (Credit Operations)</option>
              <option value="admin">Super Admin (Full Platform Root)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Enroll Identity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UserManagementPage;
