import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import { formatDate } from '../../utils/formatters';
import {
  MessageSquare,
  CheckCircle,
  Clock,
  User,
  ShieldCheck,
  Eye,
  Check,
  Send,
  AlertCircle,
} from 'lucide-react';

export function EmployeeComplaintsPage() {
  const { user } = useAuth();
  const { complaints, updateComplaintStatus } = useBanking();

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('resolved');
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredTickets = complaints.filter(
    (c) => statusFilter === 'all' || c.status === statusFilter
  );

  const handleOpenTriage = (ticket) => {
    setSelectedTicket(ticket);
    setResolutionStatus(ticket.status === 'open' ? 'in_review' : 'resolved');
    setResolutionNote(ticket.resolutionNote || '');
  };

  const handleSaveResolution = (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    updateComplaintStatus(selectedTicket.id, {
      status: resolutionStatus,
      resolutionNote: resolutionNote.trim(),
      reviewerName: user?.name || 'David Chen (Senior Officer)',
    });

    setSelectedTicket(null);
  };

  const columns = [
    {
      header: 'Ticket ID & Client',
      key: 'ticketNumber',
      render: (_, item) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-royal-600 dark:text-teal-400">
              {item.ticketNumber}
            </span>
            <Badge
              variant={
                item.priority === 'urgent'
                  ? 'error'
                  : item.priority === 'high'
                  ? 'warning'
                  : 'royal'
              }
              size="sm"
            >
              {item.priority.toUpperCase()}
            </Badge>
          </div>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
            {item.customerName}
          </p>
          <p className="text-xs text-slate-400 font-mono">{item.customerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Category & Subject',
      key: 'subject',
      render: (v, item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{v}</p>
          <p className="text-slate-400">{item.category}</p>
        </div>
      ),
    },
    {
      header: 'Assigned Officer',
      key: 'assignedTo',
      render: (v) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{v}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (v) => {
        const variants = {
          open: 'royal',
          in_review: 'warning',
          resolved: 'success',
        };
        return (
          <Badge variant={variants[v] || 'neutral'} size="sm" dot>
            {v.replace('_', ' ').toUpperCase()}
          </Badge>
        );
      },
    },
    {
      header: 'Adjudication',
      key: 'id',
      align: 'right',
      render: (_, item) => (
        <Button
          variant="outline"
          size="xs"
          icon={Eye}
          onClick={() => handleOpenTriage(item)}
        >
          Triage Ticket
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
            Client Disputes & Complaints Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review client escalations, assign resolution officers, and record formal audit findings.
          </p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
          >
            <option value="all">All Status Queues ({complaints.length})</option>
            <option value="open">Open Inquiries</option>
            <option value="in_review">In Active Triage</option>
            <option value="resolved">Resolved Inquiries</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader
          action={
            <span className="text-xs text-slate-500">
              Showing {filteredTickets.length} tickets
            </span>
          }
        >
          <CardTitle>Dispute Resolution Queue</CardTitle>
          <CardDescription>All resolutions trigger immediate customer notifications and write to audit trail</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={filteredTickets} />
        </CardContent>
      </Card>

      {/* Triage / Resolve Ticket Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title={`Triage Inquiry: ${selectedTicket.ticketNumber}`}
          description={`Filed by ${selectedTicket.customerName} on ${formatDate(selectedTicket.createdAt, 'full')}`}
          size="md"
        >
          <form onSubmit={handleSaveResolution} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Subject:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTicket.subject}</span>
              </div>
              <div className="pt-1 text-slate-700 dark:text-slate-300">
                <span className="text-slate-500 block mb-0.5">Description:</span>
                <p className="bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {selectedTicket.description}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                Update Adjudication Status
              </label>
              <select
                value={resolutionStatus}
                onChange={(e) => setResolutionStatus(e.target.value)}
                className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
              >
                <option value="in_review">In Review (Investigating with clearing network)</option>
                <option value="resolved">Resolved (Adjustment applied or explanation given)</option>
                <option value="open">Keep Open (Pending customer response)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                Formal Officer Findings & Resolution Note
              </label>
              <textarea
                rows={3}
                required
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="State actions taken (e.g. Credit adjustment, SWIFT trace, merchant block)..."
                className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-300 dark:border-slate-800 p-3 outline-none focus:ring-2 focus:ring-royal-500/40"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setSelectedTicket(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="teal" icon={Send}>
                Save Adjudication & Notify Client
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default EmployeeComplaintsPage;
