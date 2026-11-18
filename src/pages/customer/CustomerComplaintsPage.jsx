import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Table } from '../../components/common/Table';
import { formatDate } from '../../utils/formatters';
import {
  MessageSquare,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  ShieldAlert,
  Send,
} from 'lucide-react';

export function CustomerComplaintsPage() {
  const { user } = useAuth();
  const { complaints, createComplaint } = useBanking();

  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [category, setCategory] = useState('Wire Transfer Settlement');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  // Filter complaints for current user
  const customerComplaints = complaints.filter(
    (c) => c.customerId === (user?.id || 'usr_cust_001') || c.customerEmail === user?.email
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setLoading(true);
    createComplaint({
      customerId: user?.id || 'usr_cust_001',
      customerName: user?.name || 'Alexandra Morgan',
      customerEmail: user?.email || 'customer@novabank.com',
      category,
      subject: subject.trim(),
      description: description.trim(),
      priority,
    });

    setLoading(false);
    setIsNewComplaintOpen(false);
    setSubject('');
    setDescription('');
  };

  const columns = [
    {
      header: 'Ticket ID & Subject',
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
            {item.subject}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Category: {item.category} • Filed: {formatDate(item.createdAt, 'short')}
          </p>
        </div>
      ),
    },
    {
      header: 'Assigned Officer',
      key: 'assignedTo',
      render: (v) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {v || 'Queued for Assignment'}
        </span>
      ),
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
      header: 'Action',
      key: 'id',
      align: 'right',
      render: (_, item) => (
        <Button
          variant="outline"
          size="xs"
          onClick={() => setSelectedComplaint(item)}
        >
          View Details
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
            Client Inquiries & Dispute Resolution
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track inquiries, wire investigations, and dispute tickets with your dedicated relationship manager.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsNewComplaintOpen(true)}
        >
          File New Inquiry
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-royal-500/10 text-royal-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Open Inquiries</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {customerComplaints.filter((c) => c.status === 'open' || c.status === 'in_review').length}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Resolved Tickets</p>
            <p className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {customerComplaints.filter((c) => c.status === 'resolved').length}
            </p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Relationship Manager</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">David Chen (Officer Desk)</p>
          </div>
        </Card>
      </div>

      {/* Complaints Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs text-slate-500">
              Showing {customerComplaints.length} tickets
            </span>
          }
        >
          <CardTitle>Inquiry & Dispute History</CardTitle>
          <CardDescription>Click any ticket to review resolution notes and employee replies</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={customerComplaints} />
        </CardContent>
      </Card>

      {/* New Complaint Modal */}
      <Modal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        title="File Support Inquiry or Dispute"
        description="Directly logged into bank relationship operations queue with an automated tracking reference."
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Inquiry Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="Wire Transfer Settlement">Wire Transfer Settlement</option>
              <option value="Corporate Card Dispute">Corporate Card Dispute</option>
              <option value="Commercial Treasury">Commercial Treasury Limit</option>
              <option value="Account Billing & Fees">Account Billing & Fees</option>
              <option value="Security Verification">Security Verification</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-800 p-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
            >
              <option value="medium">Medium Priority (Standard SLA)</option>
              <option value="high">High Priority (Urgent Wire)</option>
              <option value="urgent">Urgent Priority (Immediate Escalation)</option>
            </select>
          </div>

          <Input
            label="Inquiry Subject"
            placeholder="e.g. Unrecognized charge or wire delay inquiry"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
              Detailed Description & References
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide relevant account numbers, transfer references, or merchant details..."
              className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm rounded-xl border border-slate-300 dark:border-slate-800 p-3 outline-none focus:ring-2 focus:ring-royal-500/40"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsNewComplaintOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Send} isLoading={loading}>
              Submit Inquiry
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
          title={`Ticket #${selectedComplaint.ticketNumber}`}
          description={selectedComplaint.subject}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <Badge variant={selectedComplaint.status === 'resolved' ? 'success' : 'warning'} size="sm">
                  {selectedComplaint.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedComplaint.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Officer</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedComplaint.assignedTo}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Your Initial Inquiry:
              </span>
              <p className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.resolutionNote && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Officer Resolution Note:</span>
                </div>
                <p className="leading-relaxed">{selectedComplaint.resolutionNote}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button variant="primary" onClick={() => setSelectedComplaint(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default CustomerComplaintsPage;
