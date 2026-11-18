import React, { useState } from 'react';
import { useBanking } from '../../hooks/useBanking';
import { useNotification } from '../../hooks/useNotification';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { formatCurrency, formatCardNumber } from '../../utils/formatters';
import {
  CreditCard,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sliders,
  Plus,
  Wifi,
  ShieldCheck,
  Check,
} from 'lucide-react';

export function CardsPage() {
  const { cards, toggleCardFreeze, updateCardLimit } = useBanking();
  const { success } = useNotification();

  const [revealedCards, setRevealedCards] = useState({});
  const [selectedCardForLimit, setSelectedCardForLimit] = useState(null);
  const [tempLimit, setTempLimit] = useState('');
  const [isNewVirtualModalOpen, setIsNewVirtualModalOpen] = useState(false);
  const [virtualCardLabel, setVirtualCardLabel] = useState('');

  const toggleRevealCard = (cardId) => {
    setRevealedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const handleOpenLimitModal = (card) => {
    setSelectedCardForLimit(card);
    setTempLimit(card.dailyLimit.toString());
  };

  const handleSaveLimit = (e) => {
    e.preventDefault();
    if (selectedCardForLimit) {
      updateCardLimit(selectedCardForLimit.id, Number(tempLimit));
      setSelectedCardForLimit(null);
    }
  };

  const handleCreateVirtualCard = (e) => {
    e.preventDefault();
    success(`Virtual card "${virtualCardLabel || 'Single-Use Online'}" created successfully.`);
    setIsNewVirtualModalOpen(false);
    setVirtualCardLabel('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Corporate & Digital Cards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage physical titanium cards, instant virtual tokens, and security freezes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="teal"
            icon={Plus}
            onClick={() => setIsNewVirtualModalOpen(true)}
          >
            Create Virtual Card
          </Button>
        </div>
      </div>

      {/* Cards List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isRevealed = revealedCards[card.id];

          return (
            <Card key={card.id} className="flex flex-col justify-between overflow-hidden">
              {/* Card Face Visualizer */}
              <div
                className={`p-6 bg-gradient-to-tr ${card.gradient} text-white shadow-fintech-lg relative transition-all duration-300 min-h-[210px] flex flex-col justify-between`}
              >
                {/* Frosted Shimmer Overlay */}
                <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-[1px] pointer-events-none" />

                {/* Top Row: Bank Name + Chip/Contactless */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-wider">
                      NOVA<span className="text-teal-400">BANK</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-white/20">
                      {card.tier}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-slate-300 rotate-90" />
                    {card.isFrozen && (
                      <Badge variant="error" size="sm">
                        FROZEN
                      </Badge>
                    )}
                  </div>
                </div>

                {/* EMV Microchip Graphic */}
                <div className="relative z-10 my-2">
                  <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-500 shadow-inner flex items-center justify-center">
                    <div className="w-6 h-4 border border-amber-800/40 rounded-sm" />
                  </div>
                </div>

                {/* Card Number */}
                <div className="relative z-10 font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100">
                  {isRevealed
                    ? formatCardNumber(card.cardNumber)
                    : `•••• •••• •••• ${card.cardNumber.slice(-4)}`}
                </div>

                {/* Cardholder + Expiry */}
                <div className="flex items-end justify-between relative z-10 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                      Cardholder
                    </span>
                    <span className="font-semibold tracking-wider">
                      {card.cardholderName}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                      Expires / CVV
                    </span>
                    <span className="font-mono font-semibold">
                      {card.expiry} {isRevealed ? `(CVV: ${card.cvv})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Management Controls */}
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    Daily Spending Limit:
                  </span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(card.dailyLimit, 'USD', false)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    Monthly Spent:
                  </span>
                  <span className="font-mono font-semibold text-royal-600 dark:text-teal-400">
                    {formatCurrency(card.monthlySpent)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {/* Freeze / Unfreeze */}
                  <Button
                    variant={card.isFrozen ? 'teal' : 'danger'}
                    size="sm"
                    icon={card.isFrozen ? Unlock : Lock}
                    onClick={() => toggleCardFreeze(card.id)}
                  >
                    {card.isFrozen ? 'Unfreeze' : 'Freeze'}
                  </Button>

                  {/* Reveal CVV / Details */}
                  <Button
                    variant="outline"
                    size="sm"
                    icon={isRevealed ? EyeOff : Eye}
                    onClick={() => toggleRevealCard(card.id)}
                  >
                    {isRevealed ? 'Hide' : 'Reveal'}
                  </Button>

                  {/* Set Limit */}
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Sliders}
                    onClick={() => handleOpenLimitModal(card)}
                  >
                    Limits
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Adjust Daily Limit Modal */}
      {selectedCardForLimit && (
        <Modal
          isOpen={Boolean(selectedCardForLimit)}
          onClose={() => setSelectedCardForLimit(null)}
          title={`Adjust Spending Limit • Card ending ${selectedCardForLimit.cardNumber.slice(-4)}`}
          description="Changes take effect immediately across all global payment terminals."
          size="sm"
        >
          <form onSubmit={handleSaveLimit} className="space-y-4">
            <Input
              label="Daily Limit (USD)"
              type="number"
              min="500"
              max="100000"
              step="500"
              value={tempLimit}
              onChange={(e) => setTempLimit(e.target.value)}
              required
              helperText="Maximum allowed daily limit: $100,000.00"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setSelectedCardForLimit(null)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Limit
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Create Virtual Card Modal */}
      <Modal
        isOpen={isNewVirtualModalOpen}
        onClose={() => setIsNewVirtualModalOpen(false)}
        title="Issue New Virtual Card"
        description="Instant tokenized card for secure software subscriptions or online procurement."
        size="md"
      >
        <form onSubmit={handleCreateVirtualCard} className="space-y-4">
          <Input
            label="Card Descriptor"
            placeholder="e.g. OpenAI API Billing or AWS Hosting"
            value={virtualCardLabel}
            onChange={(e) => setVirtualCardLabel(e.target.value)}
            required
          />

          <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 space-y-1">
            <p className="font-semibold">Security Shield Enabled</p>
            <p>
              Virtual cards are dynamically masked with Visa Token Service to prevent unauthorized vendor recurring charges.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsNewVirtualModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="teal">
              Generate Instant Card
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CardsPage;
