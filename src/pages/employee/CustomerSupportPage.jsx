import React, { useState } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Table } from '../../components/common/Table';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { formatDate } from '../../utils/formatters';
import {
  Headphones,
  MessageSquare,
  Send,
  User,
  Clock,
  CheckCircle,
} from 'lucide-react';

export function CustomerSupportPage() {
  const { success } = useNotification();

  const [tickets, setTickets] = useState([
    {
      id: 'tkt_801',
      clientName: 'Alexandra Morgan',
      tier: 'Platinum Elite',
      subject: 'Foreign Exchange Rate Quote for Singapore Wire ($1.2M)',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-18T11:30:00Z',
    },
    {
      id: 'tkt_802',
      clientName: 'Apex Technologies Inc',
      tier: 'Commercial Tier 1',
      subject: 'Request Temporary Increase in Daily Automated Payroll ACH Limit',
      priority: 'urgent',
      status: 'in_progress',
      createdAt: '2026-11-18T10:15:00Z',
    },
    {
      id: 'tkt_803',
      clientName: 'BioTech Dynamics',
      tier: 'Institutional',
      subject: 'Escrow Release Confirmation for Acquisition Bridge',
      priority: 'normal',
      status: 'resolved',
      createdAt: '2026-11-17T16:00:00Z',
    },
  ]);

  const [activeTicket, setActiveTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const handleSendReply = (e) => {
    e.preventDefault();
    success(`Priority reply dispatched to ${activeTicket?.clientName} via encrypted secure message.`);
    setActiveTicket(null);
    setReplyMessage('');
  };

  const columns = [
    {
      header: 'Client & Tier',
      key: 'clientName',
      render: (_, tkt) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
            {tkt.clientName}
          </p>
          <p className="text-xs text-royal-600 dark:text-royal-400 font-medium">{tkt.tier}</p>
        </div>
      ),
    },
    {
      header: 'Inquiry Subject',
      key: 'subject',
      render: (v) => <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{v}</span>,
    },
    {
      header: 'Priority',
      key: 'priority',
      align: 'center',
      render: (v) => (
        <Badge
          variant={v === 'urgent' ? 'error' : v === 'high' ? 'warning' : 'royal'}
          size="sm"
        >
          {v.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      align: 'center',
      render: (v) => (
        <Badge
          variant={v === 'resolved' ? 'success' : v === 'in_progress' ? 'teal' : 'royal'}
          size="sm"
          dot
        >
          {v.replace('_', ' ').toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      key: 'id',
      align: 'right',
      render: (_, tkt) => (
        <Button
          variant="outline"
          size="xs"
          icon={MessageSquare}
          onClick={() => setActiveTicket(tkt)}
        >
          Reply
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Private Client Priority Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Direct liaison desk for high-net-worth portfolio inquiries and bespoke wire requests.
        </p>
      </div>

      <Card>
        <CardHeader
          action={
            <Badge variant="teal" size="sm">
              SLA: 10 Min Target
            </Badge>
          }
        >
          <CardTitle>Active Client Inquiries</CardTitle>
          <CardDescription>Secure communications channel with dedicated relationship officer</CardDescription>
        </CardHeader>
        <CardContent noPadding>
          <Table columns={columns} data={tickets} />
        </CardContent>
      </Card>

      {/* Reply Modal */}
      {activeTicket && (
        <Modal
          isOpen={Boolean(activeTicket)}
          onClose={() => setActiveTicket(null)}
          title={`Secure Client Liaison: ${activeTicket.clientName}`}
          description={activeTicket.subject}
          size="md"
        >
          <form onSubmit={handleSendReply} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 block mb-1">Inquiry Description:</span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {activeTicket.subject}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                Officer Response (Signed & Encrypted)
              </label>
              <textarea
                rows={4}
                required
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response to the client..."
                className="w-full bg-white dark:bg-[#0c1626] text-slate-900 dark:text-slate-100 text-sm font-normal rounded-xl border border-slate-300 dark:border-slate-800 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-royal-500/40"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setActiveTicket(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="teal" icon={Send}>
                Transmit Secure Message
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default CustomerSupportPage;
