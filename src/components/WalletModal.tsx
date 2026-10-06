import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, Plus, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { User, WalletTransaction } from '../types';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  transactions: WalletTransaction[];
  onAddFunds?: (amount: number, note?: string) => void;
  onWithdrawFunds?: (amount: number, details?: string) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  transactions,
  onAddFunds,
  onWithdrawFunds,
}) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'withdraw' | 'deposit'>('balance');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(5000);
  const [withdrawMethod, setWithdrawMethod] = useState<'JazzCash' | 'Easypaisa' | 'Raast' | 'Bank'>('JazzCash');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [depositAmount, setDepositAmount] = useState<number>(2000);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || withdrawAmount <= 0) return;
    if (withdrawAmount > currentUser.walletBalancePKR) {
      alert('Insufficient wallet balance!');
      return;
    }
    if (onWithdrawFunds) {
      onWithdrawFunds(withdrawAmount, `${withdrawMethod}: ${accountNumber} (${accountTitle})`);
    }
    setToastMsg(`Withdrawal request of PKR ${withdrawAmount.toLocaleString()} submitted via ${withdrawMethod}!`);
    setTimeout(() => {
      setToastMsg(null);
      setActiveTab('balance');
    }, 2000);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || depositAmount <= 0) return;
    if (onAddFunds) {
      onAddFunds(depositAmount, 'Deposit to wallet');
    }
    setToastMsg(`Funds deposit of PKR ${depositAmount.toLocaleString()} credited successfully!`);
    setTimeout(() => {
      setToastMsg(null);
      setActiveTab('balance');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">YourMart Escrow & Margin Wallet</h3>
              <p className="text-xs text-slate-400">Automated COD settlements, payouts & referral commissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-1">Available Payout Balance</span>
            <div className="text-3xl font-black text-white font-mono flex items-baseline gap-2">
              <span className="text-emerald-400">PKR</span>
              <span>{Number(currentUser.walletBalancePKR || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Protected by State Bank Licensed Partner Banks</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('withdraw')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Withdraw</span>
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Balance</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('balance')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'balance' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transaction History ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'withdraw' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Instant Withdrawal
          </button>
          <button
            onClick={() => setActiveTab('deposit')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'deposit' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Top-up Wallet
          </button>
        </div>

        {/* View 1: History */}
        {activeTab === 'balance' && (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {transactions.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">No transactions recorded yet.</p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === 'DEBIT' || tx.type === 'PAYOUT'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {tx.type === 'DEBIT' || tx.type === 'PAYOUT' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{tx.description}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">{tx.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-black font-mono ${
                        tx.type === 'DEBIT' || tx.type === 'PAYOUT' ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {tx.type === 'DEBIT' || tx.type === 'PAYOUT' ? '-' : '+'} PKR {Number(tx.amountPKR).toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">{tx.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* View 2: Withdraw Form */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Withdrawal Method</label>
              <div className="grid grid-cols-4 gap-2">
                {(['JazzCash', 'Easypaisa', 'Raast', 'Bank'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setWithdrawMethod(m)}
                    className={`py-2 px-1 text-center rounded-xl font-bold border transition ${
                      withdrawMethod === m
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 font-medium block mb-1">Withdraw Amount (PKR)</label>
              <input
                type="number"
                required
                min={500}
                max={currentUser.walletBalancePKR}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Account Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamza Khan"
                  value={accountTitle}
                  onChange={(e) => setAccountTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 font-medium block mb-1">Account / Mobile / IBAN</label>
                <input
                  type="text"
                  required
                  placeholder="0321-xxxxxxx"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              Request Instant Withdrawal
            </button>
          </form>
        )}

        {/* View 3: Deposit Form */}
        {activeTab === 'deposit' && (
          <form onSubmit={handleDeposit} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Top-Up Amount (PKR)</label>
              <input
                type="number"
                required
                min={100}
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              Transfer funds via Meezan Bank Raast ID: <strong className="text-emerald-400">03008451234</strong>. Instant simulation will credit your account balance.
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer"
            >
              Simulate Instant Top-up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
