import {
  MOCK_USERS,
  MOCK_ACCOUNTS,
  MOCK_TRANSACTIONS,
  MOCK_BUDGETS,
  MOCK_COMPLAINTS,
  MOCK_FRAUD_ALERTS,
  MOCK_SECURITY_ALERTS,
  MOCK_NOTIFICATIONS,
  MOCK_CARDS,
  MOCK_AUDIT_LOGS,
  MOCK_LOANS,
  MOCK_CASHFLOW_METRICS,
  MOCK_SPENDING_CATEGORIES,
  MOCK_SYSTEM_HEALTH,
} from '../data/mockBankingData';
import { storageService } from './storageService';
import { generateReferenceId } from '../utils/formatters';

const KEYS = {
  ACCOUNTS: 'accounts_state',
  TRANSACTIONS: 'transactions_state',
  BUDGETS: 'budgets_state',
  COMPLAINTS: 'complaints_state',
  FRAUD_ALERTS: 'fraud_alerts_state',
  SECURITY_ALERTS: 'security_alerts_state',
  NOTIFICATIONS: 'notifications_state',
  CARDS: 'cards_state',
  LOANS: 'loans_state',
  AUDIT_LOGS: 'audit_logs_state',
};

class DemoDataService {
  constructor() {
    this.init();
  }

  init() {
    if (!storageService.get(KEYS.ACCOUNTS)) {
      storageService.set(KEYS.ACCOUNTS, MOCK_ACCOUNTS);
    }
    if (!storageService.get(KEYS.TRANSACTIONS)) {
      storageService.set(KEYS.TRANSACTIONS, MOCK_TRANSACTIONS);
    }
    if (!storageService.get(KEYS.BUDGETS)) {
      storageService.set(KEYS.BUDGETS, MOCK_BUDGETS);
    }
    if (!storageService.get(KEYS.COMPLAINTS)) {
      storageService.set(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
    }
    if (!storageService.get(KEYS.FRAUD_ALERTS)) {
      storageService.set(KEYS.FRAUD_ALERTS, MOCK_FRAUD_ALERTS);
    }
    if (!storageService.get(KEYS.SECURITY_ALERTS)) {
      storageService.set(KEYS.SECURITY_ALERTS, MOCK_SECURITY_ALERTS);
    }
    if (!storageService.get(KEYS.NOTIFICATIONS)) {
      storageService.set(KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    }
    if (!storageService.get(KEYS.CARDS)) {
      storageService.set(KEYS.CARDS, MOCK_CARDS);
    }
    if (!storageService.get(KEYS.LOANS)) {
      storageService.set(KEYS.LOANS, MOCK_LOANS);
    }
    if (!storageService.get(KEYS.AUDIT_LOGS)) {
      storageService.set(KEYS.AUDIT_LOGS, MOCK_AUDIT_LOGS);
    }
  }

  // --- ACCOUNTS (Requirement 4, 5) ---
  getAccounts() {
    return storageService.get(KEYS.ACCOUNTS, MOCK_ACCOUNTS);
  }

  getAccountById(id) {
    const accounts = this.getAccounts();
    return accounts.find((a) => a.id === id) || null;
  }

  getTotalBalance() {
    const accounts = this.getAccounts();
    return accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);
  }

  // --- TRANSACTIONS (Requirement 6, 7, 10, 15, 16) ---
  getTransactions(filter = {}) {
    let list = storageService.get(KEYS.TRANSACTIONS, MOCK_TRANSACTIONS);
    if (filter.accountId && filter.accountId !== 'all') {
      list = list.filter((tx) => tx.accountId === filter.accountId);
    }
    if (filter.type && filter.type !== 'all') {
      list = list.filter((tx) => tx.type === filter.type);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.merchant?.toLowerCase().includes(q) ||
          tx.reference.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  getTransactionById(id) {
    const transactions = this.getTransactions();
    return transactions.find((t) => t.id === id) || null;
  }

  /**
   * Execute an instant transfer (Requirement 5, 6, 8, 10, 17)
   */
  executeTransfer({
    sourceAccountId,
    recipientName,
    recipientAccount,
    amount,
    memo,
    category = 'Wire Transfer',
    actorName = 'Alexandra Morgan (Customer)',
  }) {
    const accounts = this.getAccounts();
    const sourceIndex = accounts.findIndex((a) => a.id === sourceAccountId);

    if (sourceIndex === -1) {
      throw new Error('Source account not found');
    }

    const numericAmount = Number(amount);
    if (accounts[sourceIndex].availableBalance < numericAmount) {
      throw new Error('Insufficient available balance');
    }

    // 1. Deduct from source account
    accounts[sourceIndex].balance -= numericAmount;
    accounts[sourceIndex].availableBalance -= numericAmount;
    storageService.set(KEYS.ACCOUNTS, accounts);

    // 2. Determine if transaction exceeds AML threshold ($50,000)
    const isHighValue = numericAmount >= 50000;
    const txId = `tx_${Date.now()}`;
    const reference = generateReferenceId('TXN-NOV');

    // 3. Record outbound transaction
    const newTx = {
      id: txId,
      reference,
      customerId: accounts[sourceIndex].customerId || 'usr_cust_001',
      description: memo || `Wire transfer to ${recipientName}`,
      category,
      amount: -numericAmount,
      type: 'debit',
      status: isHighValue ? 'pending' : 'completed',
      date: new Date().toISOString(),
      accountId: sourceAccountId,
      accountName: accounts[sourceIndex].name,
      merchant: recipientName,
      fee: 0.00,
      flagged: isHighValue,
      flagReason: isHighValue ? 'High-value transfer exceeding $50k AML threshold' : null,
    };

    const transactions = storageService.get(KEYS.TRANSACTIONS, MOCK_TRANSACTIONS);
    const updatedTransactions = [newTx, ...transactions];
    storageService.set(KEYS.TRANSACTIONS, updatedTransactions);

    // 4. Update Budget category spend if applicable (Requirement 8)
    this.recordBudgetExpense(category, numericAmount);

    // 5. If high value, create a Fraud Sentinel Investigation alert (Requirement 15, 16)
    if (isHighValue) {
      this.createFraudAlert({
        transactionId: txId,
        reference,
        customerName: accounts[sourceIndex].customerId === 'usr_cust_001' ? 'Alexandra Morgan' : 'Marcus Sterling',
        type: 'AML High-Value Transfer Threshold',
        amount: numericAmount,
        details: `Outbound wire of $${numericAmount.toLocaleString()} to ${recipientName} flagged for dual-officer signoff.`,
        riskScore: 75,
      });
    }

    // 6. Create Customer in-app notification (Requirement 10)
    this.addNotification({
      title: isHighValue ? 'Wire Transfer Pending Clearance' : 'Transfer Executed Successfully',
      message: `Outbound wire of $${numericAmount.toLocaleString()} to ${recipientName} has been recorded. Reference: ${reference}`,
      category: 'transfer',
    });

    // 7. Record immutable audit log (Requirement 17)
    this.addAuditLog({
      actor: actorName,
      action: isHighValue ? 'FUNDS_TRANSFER_HELD' : 'FUNDS_TRANSFER_CLEARED',
      details: `Transferred $${numericAmount.toLocaleString()} to ${recipientName} (Account: ${recipientAccount || 'External'}) from ${accounts[sourceIndex].name}`,
      severity: isHighValue ? 'warning' : 'info',
    });

    return { success: true, transaction: newTx, isHighValue };
  }

  // --- BUDGETS & EXPENSES (Requirement 8) ---
  getBudgets() {
    const budgets = storageService.get(KEYS.BUDGETS, MOCK_BUDGETS);
    const transactions = this.getTransactions();

    // Recalculate spent dynamically from debits
    return budgets.map((bgt) => {
      const totalSpentForCat = transactions
        .filter((tx) => tx.type === 'debit' && tx.category.toLowerCase() === bgt.category.toLowerCase())
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

      return {
        ...bgt,
        spent: totalSpentForCat > 0 ? totalSpentForCat : bgt.spent,
      };
    });
  }

  recordBudgetExpense(category, amount) {
    const budgets = storageService.get(KEYS.BUDGETS, MOCK_BUDGETS);
    const index = budgets.findIndex((b) => b.category.toLowerCase() === category.toLowerCase());
    if (index !== -1) {
      budgets[index].spent += Number(amount);
      storageService.set(KEYS.BUDGETS, budgets);
    }
  }

  updateBudgetLimit(budgetId, newAllocated) {
    const budgets = storageService.get(KEYS.BUDGETS, MOCK_BUDGETS);
    const index = budgets.findIndex((b) => b.id === budgetId);
    if (index !== -1) {
      budgets[index].allocated = Number(newAllocated);
      storageService.set(KEYS.BUDGETS, budgets);

      this.addAuditLog({
        actor: 'Alexandra Morgan (Customer)',
        action: 'BUDGET_LIMIT_UPDATE',
        details: `Updated monthly budget limit for ${budgets[index].category} to $${Number(newAllocated).toLocaleString()}`,
        severity: 'info',
      });
      return budgets[index];
    }
    return null;
  }

  // --- CUSTOMER COMPLAINTS & TICKETS (Requirement 12, 13) ---
  getComplaints(filter = {}) {
    let list = storageService.get(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
    if (filter.customerId) {
      list = list.filter((c) => c.customerId === filter.customerId);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter((c) => c.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createComplaint({
    customerId = 'usr_cust_001',
    customerName = 'Alexandra Morgan',
    customerEmail = 'customer@novabank.com',
    category,
    subject,
    description,
    priority = 'medium',
  }) {
    const complaints = this.getComplaints();
    const count = complaints.length + 901;
    const ticketNumber = `TKT-NOV-2026-${count}`;

    const newComplaint = {
      id: `cmp_${Date.now()}`,
      ticketNumber,
      customerId,
      customerName,
      customerEmail,
      category,
      subject,
      description,
      priority,
      status: 'open',
      assignedTo: 'David Chen (Relationship Desk)',
      assignedToId: 'usr_emp_001',
      resolutionNote: 'Assigned to Senior Relationship Officer queue. Under active triage.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newComplaint, ...complaints];
    storageService.set(KEYS.COMPLAINTS, updated);

    // Notify customer
    this.addNotification({
      title: 'Complaint Ticket Created',
      message: `Your inquiry #${ticketNumber} (${subject}) has been logged and assigned to credit operations.`,
      category: 'complaint',
    });

    // Add Audit Log
    this.addAuditLog({
      actor: `${customerName} (Customer)`,
      action: 'COMPLAINT_FILED',
      details: `Filed inquiry #${ticketNumber}: "${subject}" (Category: ${category})`,
      severity: 'info',
    });

    return newComplaint;
  }

  updateComplaintStatus(complaintId, { status, resolutionNote, reviewerName = 'David Chen' }) {
    const complaints = storageService.get(KEYS.COMPLAINTS, MOCK_COMPLAINTS);
    const index = complaints.findIndex((c) => c.id === complaintId);

    if (index !== -1) {
      complaints[index].status = status;
      complaints[index].assignedTo = reviewerName;
      if (resolutionNote) {
        complaints[index].resolutionNote = resolutionNote;
      }
      complaints[index].updatedAt = new Date().toISOString();
      storageService.set(KEYS.COMPLAINTS, complaints);

      // Notify customer of resolution or status change
      this.addNotification({
        title: `Complaint Status: ${status.replace('_', ' ').toUpperCase()}`,
        message: `${reviewerName} updated ticket #${complaints[index].ticketNumber}: ${resolutionNote || 'Status changed'}`,
        category: 'complaint',
      });

      // Audit Log
      this.addAuditLog({
        actor: `${reviewerName} (Employee)`,
        action: status === 'resolved' ? 'COMPLAINT_RESOLVED' : 'COMPLAINT_TRIAGED',
        details: `Updated complaint #${complaints[index].ticketNumber} to ${status.toUpperCase()}. Note: ${resolutionNote || 'None'}`,
        severity: status === 'resolved' ? 'success' : 'info',
      });

      return complaints[index];
    }
    return null;
  }

  // --- FRAUD & SUSPICIOUS ACTIVITY ALERTS (Requirement 15, 16) ---
  getFraudAlerts() {
    return storageService.get(KEYS.FRAUD_ALERTS, MOCK_FRAUD_ALERTS);
  }

  createFraudAlert({ transactionId, reference, customerName, type, amount, details, riskScore }) {
    const alerts = this.getFraudAlerts();
    const newAlert = {
      id: `frd_${Date.now()}`,
      transactionId,
      reference,
      customerId: 'usr_cust_001',
      customerName,
      type,
      riskScore,
      amount,
      status: 'investigating',
      details,
      ipAddress: '198.51.100.42',
      location: 'Zurich, Switzerland',
      detectedAt: new Date().toISOString(),
    };
    storageService.set(KEYS.FRAUD_ALERTS, [newAlert, ...alerts]);
    return newAlert;
  }

  updateFraudAlertStatus(alertId, newStatus, reviewerName = 'Elena Rostova (Admin)') {
    const alerts = this.getFraudAlerts();
    const index = alerts.findIndex((a) => a.id === alertId);

    if (index !== -1) {
      alerts[index].status = newStatus;
      storageService.set(KEYS.FRAUD_ALERTS, alerts);

      this.addAuditLog({
        actor: reviewerName,
        action: `FRAUD_ALERT_${newStatus.toUpperCase()}`,
        details: `Updated fraud investigation #${alertId} (${alerts[index].type}) to status: ${newStatus}`,
        severity: newStatus === 'blocked' ? 'error' : 'info',
      });

      return alerts[index];
    }
    return null;
  }

  // --- SECURITY ALERTS & CENTER (Requirement 11) ---
  getSecurityAlerts() {
    return storageService.get(KEYS.SECURITY_ALERTS, MOCK_SECURITY_ALERTS);
  }

  addSecurityAlert({ title, description, severity = 'info', icon = 'ShieldCheck' }) {
    const alerts = this.getSecurityAlerts();
    const newAlert = {
      id: `sec_${Date.now()}`,
      title,
      description,
      severity,
      timestamp: new Date().toISOString(),
      icon,
    };
    storageService.set(KEYS.SECURITY_ALERTS, [newAlert, ...alerts]);
    return newAlert;
  }

  // --- IN-APP NOTIFICATIONS (Requirement 10, 11, 13) ---
  getNotifications() {
    return storageService.get(KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  }

  addNotification({ title, message, category = 'account' }) {
    const notifications = this.getNotifications();
    const newNotif = {
      id: `notif_${Date.now()}`,
      title,
      message,
      category,
      read: false,
      timestamp: new Date().toISOString(),
    };
    storageService.set(KEYS.NOTIFICATIONS, [newNotif, ...notifications]);
    return newNotif;
  }

  markNotificationAsRead(id) {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    storageService.set(KEYS.NOTIFICATIONS, updated);
    return updated;
  }

  markAllNotificationsAsRead() {
    const notifications = this.getNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    storageService.set(KEYS.NOTIFICATIONS, updated);
    return updated;
  }

  // --- CARDS ---
  getCards() {
    return storageService.get(KEYS.CARDS, MOCK_CARDS);
  }

  toggleCardFreeze(cardId) {
    const cards = this.getCards();
    const index = cards.findIndex((c) => c.id === cardId);
    if (index !== -1) {
      cards[index].isFrozen = !cards[index].isFrozen;
      storageService.set(KEYS.CARDS, cards);

      const status = cards[index].isFrozen ? 'FROZEN' : 'UNFROZEN';
      this.addAuditLog({
        actor: 'Alexandra Morgan (Customer)',
        action: 'CARD_STATUS_TOGGLE',
        details: `Card ending ${cards[index].cardNumber.slice(-4)} set to ${status}`,
        severity: 'info',
      });

      this.addSecurityAlert({
        title: `Card ${status}`,
        description: `Your ${cards[index].cardType} ending in ${cards[index].cardNumber.slice(-4)} has been ${status.toLowerCase()}.`,
        severity: cards[index].isFrozen ? 'warning' : 'info',
        icon: 'CreditCard',
      });

      return cards[index];
    }
    return null;
  }

  updateCardLimit(cardId, newLimit) {
    const cards = this.getCards();
    const index = cards.findIndex((c) => c.id === cardId);
    if (index !== -1) {
      cards[index].dailyLimit = Number(newLimit);
      storageService.set(KEYS.CARDS, cards);
      return cards[index];
    }
    return null;
  }

  // --- LOANS (EMPLOYEE) ---
  getLoans() {
    return storageService.get(KEYS.LOANS, MOCK_LOANS);
  }

  updateLoanStatus(loanId, status, reviewerName = 'David Chen') {
    const loans = this.getLoans();
    const index = loans.findIndex((l) => l.id === loanId);
    if (index !== -1) {
      loans[index].status = status;
      loans[index].reviewedBy = reviewerName;
      loans[index].reviewedAt = new Date().toISOString();
      storageService.set(KEYS.LOANS, loans);

      this.addAuditLog({
        actor: `${reviewerName} (Employee)`,
        action: status === 'approved' ? 'LOAN_APPROVAL' : 'LOAN_REJECTION',
        details: `${status.toUpperCase()} facility #${loanId} for ${loans[index].applicantName} ($${loans[index].amount.toLocaleString()})`,
        severity: status === 'approved' ? 'success' : 'warning',
      });

      return loans[index];
    }
    return null;
  }

  // --- AUDIT LOGS (ADMIN - Requirement 17) ---
  getAuditLogs() {
    return storageService.get(KEYS.AUDIT_LOGS, MOCK_AUDIT_LOGS);
  }

  addAuditLog({ actor, action, details, severity = 'info' }) {
    const logs = this.getAuditLogs();
    const newLog = {
      id: `aud_${Date.now()}`,
      actor,
      action,
      details,
      ipAddress: '198.51.100.24',
      severity,
      timestamp: new Date().toISOString(),
    };
    storageService.set(KEYS.AUDIT_LOGS, [newLog, ...logs]);
    return newLog;
  }

  // --- AI ASSISTANT QUERY RESOLVER (Requirement 9) ---
  askAiAssistant(question = '') {
    const q = question.toLowerCase();
    const accounts = this.getAccounts();
    const totalBalance = this.getTotalBalance();
    const transactions = this.getTransactions();
    const budgets = this.getBudgets();
    const primaryAccount = accounts[0];

    if (q.includes('balance') || q.includes('how much money') || q.includes('net worth')) {
      return {
        answer: `Your total combined portfolio balance is $${totalBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}, distributed across ${accounts.length} active accounts. Your primary checking account (${primaryAccount.name}) holds $${primaryAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}.`,
        sources: accounts.map((a) => `${a.name}: $${a.balance.toLocaleString()}`),
      };
    }

    if (q.includes('interest') || q.includes('yield') || q.includes('apy') || q.includes('rate')) {
      const savings = accounts.find((a) => a.type === 'savings') || accounts[1];
      return {
        answer: `Your highest yield account is the ${savings.name} earning ${savings.interestRate} APY. In the last monthly cycle, it generated $1,642.30 in interest dividends directly backed by US Treasury obligations.`,
        sources: [`${savings.name}: ${savings.interestRate} APY`],
      };
    }

    if (q.includes('spend') || q.includes('expense') || q.includes('spent') || q.includes('budget')) {
      const topBudget = budgets.reduce((prev, curr) => (curr.spent > prev.spent ? curr : prev), budgets[0]);
      return {
        answer: `This month you have spent a total of $38,820.75 across corporate cards, cloud operations, and wires. Your largest expenditure category is ${topBudget.category} ($${topBudget.spent.toLocaleString()} of $${topBudget.allocated.toLocaleString()} allocated budget).`,
        sources: budgets.map((b) => `${b.category}: $${b.spent.toLocaleString()} / $${b.allocated.toLocaleString()}`),
      };
    }

    if (q.includes('wire') || q.includes('transfer') || q.includes('recent') || q.includes('transaction')) {
      const recent = transactions.slice(0, 3);
      return {
        answer: `Your most recent activity was "${recent[0].description}" for $${Math.abs(recent[0].amount).toLocaleString()} on ${new Date(recent[0].date).toLocaleDateString()}. All domestic ACH and Fedwires under $50,000 clear instantly with zero processing fees.`,
        sources: recent.map((r) => `${r.description} ($${r.amount})`),
      };
    }

    if (q.includes('security') || q.includes('safe') || q.includes('fraud') || q.includes('protect')) {
      return {
        answer: `Your account security health is rated "Optimal" (Score: 98/100). FIDO2 WebAuthn hardware keys are enforced, 2FA is active, and daily velocity checks are monitoring transactions against fraud sentinel AS14061.`,
        sources: ['FIDO2 Hardware Key: Enrolled', 'AML Velocity Rule: Active'],
      };
    }

    return {
      answer: `NOVABANK AI Assistant analyzed your financial ledger. Your accounts are in good standing with $${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} total liquidity. You can ask me about your balances, interest rates, monthly spending, recent wires, or security health.`,
      sources: ['Real-Time Ledger v1.0.0'],
    };
  }

  // --- FACTORY RESET ---
  resetAll() {
    storageService.clearAll();
    this.init();
    return true;
  }
}

export const demoDataService = new DemoDataService();
