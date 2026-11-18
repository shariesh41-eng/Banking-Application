import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { demoDataService } from '../services/demoDataService';
import { useNotificationContext } from './NotificationContext';

const BankingContext = createContext();

export function BankingProvider({ children }) {
  const { success, error } = useNotificationContext();

  const [accounts, setAccounts] = useState(() => demoDataService.getAccounts());
  const [transactions, setTransactions] = useState(() => demoDataService.getTransactions());
  const [budgets, setBudgets] = useState(() => demoDataService.getBudgets());
  const [complaints, setComplaints] = useState(() => demoDataService.getComplaints());
  const [fraudAlerts, setFraudAlerts] = useState(() => demoDataService.getFraudAlerts());
  const [securityAlerts, setSecurityAlerts] = useState(() => demoDataService.getSecurityAlerts());
  const [notifications, setNotifications] = useState(() => demoDataService.getNotifications());
  const [cards, setCards] = useState(() => demoDataService.getCards());
  const [loans, setLoans] = useState(() => demoDataService.getLoans());
  const [auditLogs, setAuditLogs] = useState(() => demoDataService.getAuditLogs());

  // Interactive UI dialog states
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  const refreshBankingData = useCallback(() => {
    setAccounts([...demoDataService.getAccounts()]);
    setTransactions([...demoDataService.getTransactions()]);
    setBudgets([...demoDataService.getBudgets()]);
    setComplaints([...demoDataService.getComplaints()]);
    setFraudAlerts([...demoDataService.getFraudAlerts()]);
    setSecurityAlerts([...demoDataService.getSecurityAlerts()]);
    setNotifications([...demoDataService.getNotifications()]);
    setCards([...demoDataService.getCards()]);
    setLoans([...demoDataService.getLoans()]);
    setAuditLogs([...demoDataService.getAuditLogs()]);
  }, []);

  /**
   * Execute funds transfer with full cross-module consistency
   * Updates: Accounts, Transactions, Budgets, Notifications, and Audit Logs!
   */
  const transferFunds = useCallback(
    async (transferDetails) => {
      try {
        const result = demoDataService.executeTransfer(transferDetails);
        refreshBankingData();

        if (result.isHighValue) {
          success(
            `Transfer of $${Number(transferDetails.amount).toLocaleString()} initiated. Placed in dual-officer AML clearance queue.`
          );
        } else {
          success(
            `Successfully transferred $${Number(transferDetails.amount).toLocaleString()} to ${
              transferDetails.recipientName
            }`
          );
        }
        return { success: true, transaction: result.transaction };
      } catch (err) {
        error(err.message || 'Transfer failed. Please check funds and details.');
        return { success: false, error: err.message };
      }
    },
    [refreshBankingData, success, error]
  );

  /**
   * Customer Complaint Workflow
   */
  const createComplaint = useCallback(
    (complaintData) => {
      try {
        const newComplaint = demoDataService.createComplaint(complaintData);
        refreshBankingData();
        success(`Dispute ticket #${newComplaint.ticketNumber} created and assigned to relationship operations.`);
        return { success: true, complaint: newComplaint };
      } catch (err) {
        error(err.message || 'Failed to file complaint.');
        return { success: false, error: err.message };
      }
    },
    [refreshBankingData, success, error]
  );

  const updateComplaintStatus = useCallback(
    (complaintId, updateData) => {
      try {
        const updated = demoDataService.updateComplaintStatus(complaintId, updateData);
        refreshBankingData();
        success(`Ticket #${updated.ticketNumber} updated to ${updateData.status.toUpperCase()}.`);
        return { success: true, complaint: updated };
      } catch (err) {
        error(err.message || 'Failed to update complaint.');
        return { success: false, error: err.message };
      }
    },
    [refreshBankingData, success, error]
  );

  /**
   * Budget adjustments
   */
  const updateBudgetLimit = useCallback(
    (budgetId, newLimit) => {
      const updated = demoDataService.updateBudgetLimit(budgetId, newLimit);
      refreshBankingData();
      if (updated) {
        success(`Budget limit for ${updated.category} updated to $${Number(newLimit).toLocaleString()}`);
      }
      return updated;
    },
    [refreshBankingData, success]
  );

  /**
   * Fraud alert investigations
   */
  const updateFraudAlertStatus = useCallback(
    (alertId, newStatus, reviewerName) => {
      const updated = demoDataService.updateFraudAlertStatus(alertId, newStatus, reviewerName);
      refreshBankingData();
      if (updated) {
        success(`Fraud investigation #${alertId} updated to status: ${newStatus.toUpperCase()}`);
      }
      return updated;
    },
    [refreshBankingData, success]
  );

  /**
   * Notification management
   */
  const markNotificationAsRead = useCallback(
    (id) => {
      demoDataService.markNotificationAsRead(id);
      refreshBankingData();
    },
    [refreshBankingData]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    demoDataService.markAllNotificationsAsRead();
    refreshBankingData();
    success('All alerts marked as read.');
  }, [refreshBankingData, success]);

  /**
   * Card and Loan operations
   */
  const toggleCardFreeze = useCallback(
    (cardId) => {
      const updatedCard = demoDataService.toggleCardFreeze(cardId);
      refreshBankingData();
      if (updatedCard) {
        const action = updatedCard.isFrozen ? 'Frozen' : 'Unfrozen';
        success(`Card ending in ${updatedCard.cardNumber.slice(-4)} has been ${action}.`);
      }
      return updatedCard;
    },
    [refreshBankingData, success]
  );

  const updateCardLimit = useCallback(
    (cardId, limit) => {
      const updatedCard = demoDataService.updateCardLimit(cardId, limit);
      refreshBankingData();
      if (updatedCard) {
        success(`Daily limit updated to $${Number(limit).toLocaleString()}.`);
      }
      return updatedCard;
    },
    [refreshBankingData, success]
  );

  const updateLoanStatus = useCallback(
    (loanId, status, reviewerName) => {
      const updatedLoan = demoDataService.updateLoanStatus(loanId, status, reviewerName);
      refreshBankingData();
      if (updatedLoan) {
        if (status === 'approved') {
          success(`Loan application #${loanId} for ${updatedLoan.applicantName} approved.`);
        } else {
          success(`Loan application #${loanId} status updated to: ${status}.`);
        }
      }
      return updatedLoan;
    },
    [refreshBankingData, success]
  );

  /**
   * AI Assistant query
   */
  const askAiAssistant = useCallback((question) => {
    return demoDataService.askAiAssistant(question);
  }, []);

  /**
   * Factory Reset
   */
  const resetData = useCallback(() => {
    demoDataService.resetAll();
    refreshBankingData();
    success('Demo banking state restored to initial factory defaults.');
  }, [refreshBankingData, success]);

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  }, [accounts]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions,
        budgets,
        complaints,
        fraudAlerts,
        securityAlerts,
        notifications,
        unreadNotificationsCount,
        cards,
        loans,
        auditLogs,
        totalBalance,
        isTransferModalOpen,
        setIsTransferModalOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        transferFunds,
        createComplaint,
        updateComplaintStatus,
        updateBudgetLimit,
        updateFraudAlertStatus,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        askAiAssistant,
        toggleCardFreeze,
        updateCardLimit,
        updateLoanStatus,
        refreshBankingData,
        resetData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}

export function useBankingContext() {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBankingContext must be used within a BankingProvider');
  }
  return context;
}
